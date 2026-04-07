package com.klu.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Pointcut for all controller methods
    @Pointcut("execution(* com.klu.controller..*(..))")
    public void controllerMethods() {}

    // Pointcut for all service methods
    @Pointcut("execution(* com.klu.service..*(..))")
    public void serviceMethods() {}

    // Before advice - logs method entry for controller
    @Before("controllerMethods()")
    public void logBeforeController(JoinPoint joinPoint) {
        logger.info("➡ Controller: {}.{}() called with args: {}",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));
    }

    // AfterReturning advice - logs method exit for service
    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logAfterService(JoinPoint joinPoint, Object result) {
        logger.info("✅ Service: {}.{}() returned successfully",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName());
    }

    // AfterThrowing advice - logs exceptions
    @AfterThrowing(pointcut = "controllerMethods() || serviceMethods()", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
        logger.error("❌ Exception in {}.{}(): {}",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName(),
                ex.getMessage());
    }

    // Around advice - performance monitoring for service methods
    @Around("serviceMethods()")
    public Object logPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long duration = System.currentTimeMillis() - startTime;
        logger.info("⏱ {}.{}() executed in {} ms",
                joinPoint.getSignature().getDeclaringType().getSimpleName(),
                joinPoint.getSignature().getName(),
                duration);

        return result;
    }
}
