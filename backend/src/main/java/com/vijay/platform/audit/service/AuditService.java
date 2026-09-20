package com.vijay.platform.audit.service;

import com.vijay.platform.audit.entity.AuditLog;
import com.vijay.platform.audit.repository.AuditLogRepository;
import com.vijay.platform.common.context.RequestContext;
import com.vijay.platform.user.entity.User;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(
            AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }

    public void log(
            User user,
            String action,
            String resourceType,
            String resourceId,
            String details) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        auditLog.setDetails(details);
        auditLog.setCreatedAt(
                java.time.LocalDateTime.now()
        );
        auditLog.setRequestId(
                RequestContext.getRequestId()
        );

        auditLog.setIpAddress(
                RequestContext.getClientIp()
        );

        auditLog.setUserAgent(
                RequestContext.getUserAgent()
        );

        auditLogRepository.save(auditLog);
    }
}