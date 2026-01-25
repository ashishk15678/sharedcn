# Security and Code Quality Review - Preview Pane Feature

## Executive Summary
This document outlines security vulnerabilities and code quality issues found in the preview pane implementation.

## Critical Security Vulnerabilities

### 1. Arbitrary Code Execution via `new Function()` - CRITICAL ⚠️
**File**: `app/src/components/live-preview.tsx` (lines 66-74)

**Issue**: The component uses `new Function()` to execute user-provided code, which is extremely dangerous.

```typescript
const func = new Function(
  "React",
  "require",
  "module",
  "exports",
  transformed,
);
func(React, require, module, exports);
```

**Risk Level**: CRITICAL
- Arbitrary JavaScript execution
- Access to window object, localStorage, cookies
- Potential XSS attacks
- Data exfiltration
- Privilege escalation

**Recommended Fix**: 
- Use an iframe with sandboxing attributes
- Implement Content Security Policy (CSP)
- Use a Web Worker with restricted permissions
- Consider server-side rendering with strict sandboxing

### 2. Client-Side Code Transformation - HIGH ⚠️
**File**: `app/src/components/live-preview.tsx` (lines 42-45)

**Issue**: Using `@babel/standalone` for client-side transformation can be exploited.

```typescript
const transformed = Babel.transform(code, {
  presets: ["react", "typescript"],
  filename: "preview.tsx",
}).code;
```

**Risk Level**: HIGH
- Code injection possibilities
- Bypass of security measures
- Performance overhead

**Recommended Fix**:
- Move transformation to server-side
- Implement strict allowlisting of syntax features
- Add code sanitization before transformation

### 3. Overly Permissive CORS - MEDIUM ⚠️
**File**: `app/src/app/api/components/add/route.ts`

**Issue**: CORS allows all origins (`*`)

```typescript
"Access-Control-Allow-Origin": "*",
```

**Risk Level**: MEDIUM
- CSRF attacks
- Unauthorized data access
- Session hijacking

**Recommended Fix**:
- Whitelist specific domains
- Use environment variables for allowed origins
- Implement proper authentication checks

## Code Quality Issues

### 4. Poor Error Handling
**Multiple Files**

**Issues**:
- Generic error catching without logging
- Silent failures
- Non-descriptive error messages

**Examples**:
```typescript
// _app.ts line 242
} catch {
  throw new TRPCError({ code: "NOT_FOUND" });
}
```

**Recommended Fix**:
- Implement proper error logging
- Add contextual error information
- Use error monitoring service (e.g., Sentry)

### 5. Type Safety Issues
**File**: `app/src/trpc/routers/_app.ts`

**Issues**:
- Multiple uses of `any` type
- Loose type checking

**Examples**:
```typescript
catch (err: any)  // line 87
const f: any      // multiple locations
```

**Recommended Fix**:
- Define proper TypeScript interfaces
- Use strict type checking
- Enable `strict` mode in tsconfig.json

### 6. Hardcoded Values
**File**: `app/src/trpc/routers/_app.ts`

**Issue**: Email and username hardcoded

```typescript
where: { email: "public@ashish.services" },
```

**Recommended Fix**:
- Move to environment variables
- Use configuration management

### 7. Code Duplication
**File**: `app/src/trpc/routers/_app.ts`

**Issue**: File validation logic duplicated

**Recommended Fix**:
- Extract validation to shared utility function
- Create reusable validators

### 8. Missing Input Sanitization
**Multiple Files**

**Issue**: User input not sanitized before use

**Recommended Fix**:
- Sanitize all user inputs
- Use DOMPurify or similar libraries
- Validate against allowlists, not denylists

## Performance Issues

### 9. Large Bundle Size
**File**: `app/src/components/live-preview.tsx`

**Issue**: `@babel/standalone` is very large (~2MB)

**Recommended Fix**:
- Move transformation to server
- Use code splitting
- Implement lazy loading

### 10. No Code Debouncing
**File**: `app/src/components/live-preview.tsx`

**Issue**: Re-renders on every keystroke

**Recommended Fix**:
- Add debouncing to preview updates
- Implement virtualization for large code

## Best Practice Violations

### 11. No Rate Limiting
**File**: `app/src/app/api/components/add/route.ts`

**Issue**: No rate limiting on API endpoints

**Recommended Fix**:
- Implement rate limiting middleware
- Add request throttling
- Use API gateway

### 12. Insufficient Validation
**File**: `app/src/trpc/routers/_app.ts`

**Issue**: File extension validation too permissive

```typescript
|| f.filename.includes(".")  // This is too loose
```

**Recommended Fix**:
- Strict extension allowlist
- File content validation
- File size limits

## Recommendations Priority

### Immediate (Critical)
1. ✅ Replace `new Function()` with iframe sandboxing
2. ✅ Add CSP headers
3. ✅ Fix CORS configuration

### High Priority
4. ✅ Move Babel transformation to server
5. ✅ Add input sanitization
6. ✅ Fix type safety issues

### Medium Priority  
7. Implement rate limiting
8. Add proper error logging
9. Extract duplicate code
10. Add debouncing to preview

### Low Priority
11. Move hardcoded values to config
12. Optimize bundle size
13. Add comprehensive tests

## Testing Recommendations
- Add security tests for XSS prevention
- Implement integration tests for API routes
- Add unit tests for validation logic
- Conduct penetration testing
- Use automated security scanning tools

## Conclusion
The preview pane feature has critical security vulnerabilities that must be addressed immediately before deployment to production. The use of `new Function()` with user-provided code is extremely dangerous and should be replaced with a safer sandboxing approach.
