package com.schoolfinder.controller;

import com.schoolfinder.dto.PdfRequest;
import com.schoolfinder.dto.PdfResponse;
import com.schoolfinder.service.PdfGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;

/**
 * PDF生成API コントローラー
 */
@Slf4j
@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfGenerationService pdfGenerationService;

    /**
     * 診断結果からPDFを生成してダウンロード
     * 
     * POST /api/pdf/generate
     */
    @PostMapping("/generate")
    public ResponseEntity<Resource> generatePdf(@Valid @RequestBody PdfRequest request) {
        log.info("Received PDF generation request for: {}", request.getRespondentName());
        
        try {
            // PDF生成
            Path pdfPath = pdfGenerationService.generatePdf(request);
            
            // レスポンス作成
            Resource resource = new FileSystemResource(pdfPath);
            
            String fileName = String.format("診断結果レポート_%s.pdf", request.getRespondentName());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename*=UTF-8''" + encodeFileName(fileName))
                    .body(resource);
                    
        } catch (Exception e) {
            log.error("PDF generation failed", e);
            throw new RuntimeException("PDF generation failed: " + e.getMessage());
        }
    }

    /**
     * ヘルスチェック
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
    
    /**
     * ファイル名をURLエンコード（日本語対応）
     */
    private String encodeFileName(String fileName) {
        try {
            return java.net.URLEncoder.encode(fileName, "UTF-8")
                    .replace("+", "%20");
        } catch (Exception e) {
            return fileName;
        }
    }
}
