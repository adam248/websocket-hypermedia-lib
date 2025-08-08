/**
 * Size Verification Tests for WebSocket Hypermedia
 * Tests to verify the claimed library size and compression
 */

const fs = require('fs');
const path = require('path');
const { gzipSync } = require('zlib');

class SizeTests {
    constructor() {
        this.libraryPath = path.join(__dirname, '..', 'src', 'websocket-hypermedia.js');
    }

    // Size Test: Uncompressed Size Verification
    // JUSTIFICATION: Documentation claims maximum size of 14KB
    // - Verifies the library stays under the 14KB hard limit
    // - Ensures size claims are accurate and up-to-date
    // - Critical for users who need to verify size constraints
    async testUncompressedSize() {
        return new Promise((resolve, reject) => {
            try {
                const stats = fs.statSync(this.libraryPath);
                const sizeKB = stats.size / 1024;
                
                console.log(`📏 Library size: ${sizeKB.toFixed(1)}KB`);
                
                // Maximum size limit: 14KB as mentioned in docs
                if (sizeKB <= 14) {
                    console.log('✅ Uncompressed size within maximum limit');
                    resolve();
                } else {
                    reject(new Error(`Size ${sizeKB.toFixed(1)}KB exceeds maximum limit (14KB)`));
                }
            } catch (error) {
                reject(new Error(`Failed to read library file: ${error.message}`));
            }
        });
    }

    // Size Test: Gzipped Size Verification
    // JUSTIFICATION: Documentation claims maximum gzipped size
    // - Verifies the gzipped size stays under reasonable limits
    // - Tests actual compression ratio
    // - Critical for production deployment size verification
    async testGzippedSize() {
        return new Promise((resolve, reject) => {
            try {
                const content = fs.readFileSync(this.libraryPath, 'utf8');
                const gzipped = gzipSync(content);
                const sizeKB = gzipped.length / 1024;
                
                console.log(`📦 Gzipped size: ${sizeKB.toFixed(1)}KB`);
                
                // Maximum gzipped size: 5KB (reasonable limit for a small library)
                if (sizeKB <= 5) {
                    console.log('✅ Gzipped size within maximum limit');
                    resolve();
                } else {
                    reject(new Error(`Gzipped size ${sizeKB.toFixed(1)}KB exceeds maximum limit (5KB)`));
                }
            } catch (error) {
                reject(new Error(`Failed to compress library: ${error.message}`));
            }
        });
    }

    // Size Test: Compression Ratio Verification
    // JUSTIFICATION: Verify compression efficiency
    // - Tests that compression ratio is reasonable
    // - Ensures the library compresses well
    // - Validates size optimization claims
    async testCompressionRatio() {
        return new Promise((resolve, reject) => {
            try {
                const stats = fs.statSync(this.libraryPath);
                const uncompressedSize = stats.size;
                const content = fs.readFileSync(this.libraryPath, 'utf8');
                const gzipped = gzipSync(content);
                const compressedSize = gzipped.length;
                const ratio = (compressedSize / uncompressedSize) * 100;
                
                console.log(`📊 Compression ratio: ${ratio.toFixed(1)}%`);
                
                // Expect compression ratio to be reasonable (15-50%)
                if (ratio >= 15 && ratio <= 50) {
                    console.log('✅ Compression ratio is reasonable');
                    resolve();
                } else {
                    reject(new Error(`Compression ratio ${ratio.toFixed(1)}% outside reasonable range (15-50%)`));
                }
            } catch (error) {
                reject(new Error(`Failed to calculate compression ratio: ${error.message}`));
            }
        });
    }

    // Size Test: Size Growth Monitoring
    // JUSTIFICATION: Prevent size bloat
    // - Monitors for unexpected size increases
    // - Ensures the library stays lean
    // - Critical for maintaining performance claims
    async testSizeGrowthMonitoring() {
        return new Promise((resolve, reject) => {
            try {
                const stats = fs.statSync(this.libraryPath);
                const sizeKB = stats.size / 1024;
                
                // Hard limit: never exceed 14KB as mentioned in docs
                if (sizeKB <= 14) {
                    console.log('✅ Library size within hard limit (14KB)');
                    resolve();
                } else {
                    reject(new Error(`Library size ${sizeKB.toFixed(1)}KB exceeds hard limit of 14KB`));
                }
            } catch (error) {
                reject(new Error(`Failed to check size limits: ${error.message}`));
            }
        });
    }

    // Size Test: Comment Policy Compliance
    // JUSTIFICATION: Enforce no-comment policy in main library file
    // - Ensures only the single immutable comment exists at the top
    // - Prevents accidental comment additions during development
    // - Critical for maintaining minimal file size
    async testCommentPolicyCompliance() {
        return new Promise((resolve, reject) => {
            try {
                const content = fs.readFileSync(this.libraryPath, 'utf8');
                const lines = content.split('\n');
                
                // Check that first line is the immutable comment
                const firstLine = lines[0].trim();
                const expectedComment = '/* IMMUTABLE: THIS IS THE ONE AND ONLY COMMENT ALLOWED IN THIS FILE. DO NOT ADD ANY COMMENTS TO THIS FILE. WE NEED IT TO REMAIN AS SMALL AS POSSIBLE! ALL DOCUMENTATION BELONGS IN WSHM-reference.md */';
                
                if (firstLine !== expectedComment) {
                    reject(new Error(`First line is not the expected immutable comment. Found: "${firstLine}"`));
                    return;
                }
                
                // Check for any other comments in the file
                const commentPatterns = [
                    /\/\*[\s\S]*?\*\//g,  // Multi-line comments /* ... */
                    /\/\/.*$/gm,         // Single-line comments //
                    /\/\*.*?\*\//g       // Single-line /* ... */ comments
                ];
                
                let totalComments = 0;
                let commentLines = [];
                
                commentPatterns.forEach(pattern => {
                    const matches = content.match(pattern);
                    if (matches) {
                        matches.forEach(match => {
                            // Skip the first line (immutable comment)
                            const matchIndex = content.indexOf(match);
                            const lineNumber = content.substring(0, matchIndex).split('\n').length;
                            
                            if (lineNumber > 1) {
                                totalComments++;
                                commentLines.push(`Line ${lineNumber}: ${match.trim()}`);
                            }
                        });
                    }
                });
                
                if (totalComments > 0) {
                    console.log(`❌ Found ${totalComments} additional comments:`);
                    commentLines.forEach(line => console.log(`   ${line}`));
                    reject(new Error(`Found ${totalComments} additional comments in the main library file. Only the immutable comment at the top is allowed.`));
                } else {
                    console.log('✅ Comment policy compliance verified - only immutable comment found');
                    resolve();
                }
            } catch (error) {
                reject(new Error(`Failed to check comment policy: ${error.message}`));
            }
        });
    }
}

module.exports = SizeTests; 