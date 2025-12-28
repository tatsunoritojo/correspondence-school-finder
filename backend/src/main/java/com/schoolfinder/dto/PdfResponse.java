package com.schoolfinder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * PDF生成レスポンスDTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PdfResponse {
    
    /**
     * 処理成功フラグ
     */
    private boolean success;
    
    /**
     * 生成されたPDFのURL（S3署名付きURL）
     */
    private String pdfUrl;
    
    /**
     * URLの有効期限
     */
    private OffsetDateTime expiresAt;
    
    /**
     * エラーメッセージ（失敗時）
     */
    private String errorMessage;
    
    /**
     * 成功レスポンス生成
     */
    public static PdfResponse success(String pdfUrl, OffsetDateTime expiresAt) {
        return PdfResponse.builder()
                .success(true)
                .pdfUrl(pdfUrl)
                .expiresAt(expiresAt)
                .build();
    }
    
    /**
     * エラーレスポンス生成
     */
    public static PdfResponse error(String message) {
        return PdfResponse.builder()
                .success(false)
                .errorMessage(message)
                .build();
    }
}
