package com.schoolfinder.service;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;
import com.schoolfinder.dto.PdfRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * PDF生成サービス
 * Playwrightを使用してHTMLからA4サイズのPDFを生成
 */
@Slf4j
@Service
public class PdfGenerationService {

    private final TemplateEngine templateEngine;

    @Value("${pdf.output-dir}")
    private String outputDir;

    @Value("${pdf.timeout-seconds:30}")
    private int timeoutSeconds;

    private Playwright playwright;
    private Browser browser;

    public PdfGenerationService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @PostConstruct
    public void init() {
        log.info("Initializing Playwright browser...");
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                .setHeadless(true));
        log.info("Playwright browser initialized successfully");
    }

    @PreDestroy
    public void cleanup() {
        log.info("Shutting down Playwright browser...");
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }

    /**
     * 診断データからPDFを生成
     * 
     * @param request PDF生成リクエスト
     * @return 生成されたPDFファイルのパス
     */
    public Path generatePdf(PdfRequest request) {
        log.info("Starting PDF generation for: {}", request.getRespondentName());

        // 1. ThymeleafでHTML生成
        String html = generateHtml(request);

        // 2. PlaywrightでPDF生成
        Path pdfPath = renderPdf(html, request.getRespondentName());

        log.info("PDF generated successfully: {}", pdfPath);
        return pdfPath;
    }

    /**
     * ThymeleafテンプレートからHTMLを生成
     */
    private String generateHtml(PdfRequest request) {
        Context context = new Context();

        // スコアデータ
        context.setVariable("scores", request.getScores());
        context.setVariable("knockoutAnswers", request.getKnockoutAnswers());
        context.setVariable("respondentName", request.getRespondentName());
        context.setVariable("respondentType", request.getRespondentType());
        context.setVariable("answers", request.getAnswers());

        // 日付フォーマット
        if (request.getDiagnosisDate() != null) {
            String formattedDate = request.getDiagnosisDate()
                    .format(DateTimeFormatter.ofPattern("yyyy年M月d日"));
            context.setVariable("diagnosisDate", formattedDate);
        } else {
            context.setVariable("diagnosisDate", "");
        }

        // 軸データ（静的データとして定義）
        context.setVariable("axes", getAxesData());

        // レーダーチャートデータ
        context.setVariable("chartData", buildChartData(request.getScores()));

        return templateEngine.process("report", context);
    }

    /**
     * HTMLをPDFにレンダリング
     */
    private Path renderPdf(String html, String respondentName) {
        try {
            // 出力ディレクトリ確認
            Path outputPath = Paths.get(outputDir);
            if (!Files.exists(outputPath)) {
                Files.createDirectories(outputPath);
            }

            // ファイル名生成
            String fileName = String.format("診断結果レポート_%s_%d.pdf",
                    respondentName, System.currentTimeMillis());
            Path pdfPath = outputPath.resolve(fileName);

            // 一時HTMLファイル作成
            Path tempHtml = Files.createTempFile("report_", ".html");
            Files.writeString(tempHtml, html);

            try (BrowserContext browserContext = browser.newContext();
                    Page page = browserContext.newPage()) {

                // HTMLをロード
                page.navigate("file://" + tempHtml.toAbsolutePath());

                // フォント読み込み待機
                page.waitForLoadState(LoadState.NETWORKIDLE);
                Thread.sleep(500); // 追加の安全マージン

                // A4サイズでPDF生成
                // Note: マージン設定はPlaywright Java 1.40.0のAPI制約により一旦削除
                // 必要に応じてCSSで調整可能
                page.pdf(new Page.PdfOptions()
                        .setPath(pdfPath)
                        .setFormat("A4")
                        .setPrintBackground(true));
            }

            // 一時ファイル削除
            Files.deleteIfExists(tempHtml);

            return pdfPath;

        } catch (Exception e) {
            log.error("PDF generation failed", e);
            throw new RuntimeException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    /**
     * 軸データを取得（静的定義）
     */
    private List<Map<String, Object>> getAxesData() {
        return List.of(
                createAxis("AX01", "スクーリング頻度", "無理のない登校ペース",
                        "あなたは「登校頻度が少ないほうが心地よい」傾向があります。"),
                createAxis("AX02", "学費・費用", "学費の安さ",
                        "あなたは「学費や費用を重視する」傾向があります。"),
                createAxis("AX03", "オンライン学習適性", "オンライン適性",
                        "あなたは「オンライン学習の適性が高い」傾向があります。"),
                createAxis("AX04", "サポート必要度", "サポート重視",
                        "あなたは「手厚いサポートを求める」傾向があります。"),
                createAxis("AX05", "進路志向", "進路重視",
                        "あなたは「将来の進路を重視する」傾向があります。"),
                createAxis("AX06", "高校生活らしさ", "学校生活重視",
                        "あなたは「高校生活らしい体験を大事にしたい」傾向があります。"),
                createAxis("AX07", "メンタルケア", "メンタルケア",
                        "あなたは「メンタル面のサポートを重視する」傾向があります。"),
                createAxis("AX08", "専門コース志向", "専門分野",
                        "あなたは「好きな分野を深く学びたい」傾向があります。"));
    }

    private Map<String, Object> createAxis(String id, String name, String chartLabel, String description) {
        return Map.of(
                "id", id,
                "name", name,
                "chartLabel", chartLabel,
                "description", description);
    }

    private List<Map<String, Object>> buildChartData(Map<String, Double> scores) {
        List<Map<String, Object>> chartData = new ArrayList<>();
        for (var axis : getAxesData()) {
            String id = (String) axis.get("id");
            chartData.add(Map.of(
                    "subject", axis.get("chartLabel"),
                    "score", scores.getOrDefault(id, 0.0),
                    "fullMark", 5));
        }
        return chartData;
    }
}
