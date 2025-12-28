package com.schoolfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

/**
 * PDF生成リクエストDTO
 */
@Data
public class PdfRequest {
    
    /**
     * 各軸のスコア (AX01~AX08)
     * Key: 軸ID (例: "AX01")
     * Value: スコア (1.0~5.0)
     */
    @NotNull(message = "scores is required")
    private Map<String, Double> scores;
    
    /**
     * Knockout質問で選択された軸のリスト
     */
    private List<String> knockoutAnswers;
    
    /**
     * 回答者名（レポートに表示）
     */
    @NotBlank(message = "respondentName is required")
    private String respondentName;
    
    /**
     * 回答者タイプ: "child" or "parent"
     */
    @NotBlank(message = "respondentType is required")
    private String respondentType;
    
    /**
     * 診断日時
     */
    private OffsetDateTime diagnosisDate;
    
    /**
     * 全質問の回答
     * Key: 質問ID (例: "Q1-1")
     * Value: 回答値
     */
    private Map<String, Object> answers;
}
