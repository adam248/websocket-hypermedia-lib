/**
 * Size Verification Tests for WebSocket Hypermedia
 * Tests to verify the claimed library size and compression
 */

const fs = require('fs');
const path = require('path');
const { gzipSync } = require('zlib');

class SizeTests {
    constructor() {
        this.libraryPath = path.join(__dirname, '..', 'websocket-hypermedia.js');
    }

    // Size Test: Uncompressed Size Verification
    // JUSTIFICATION: Documentation claims specific size
    // - Verifies the claimed 13KB uncompressed size
    // - Ensures size claims are accurate and up-to-date
    // - Critical for users who need to verify size constraints
    async testUncompressedSize() {
        return new Promise((resolve, reject) => {
            try {
                const stats = fs.statSync(this.libraryPath);
                const sizeKB = stats.size / 1024;
                
                console.log(`📏 Library size: ${sizeKB.toFixed(1)}KB`);
                
                // Allow some tolerance (claimed 13KB, allow 11-15KB range)
                if (sizeKB >= 11 && sizeKB <= 15) {
                    console.log('✅ Uncompressed size within acceptable range');
                    resolve();
                } else {
                    reject(new Error(`Size ${sizeKB.toFixed(1)}KB outside acceptable range (11-15KB)`));
                }
            } catch (error) {
                reject(new Error(`Failed to read library file: ${error.message}`));
            }
        });
    }

    // Size Test: Gzipped Size Verification
    // JUSTIFICATION: Documentation claims specific gzipped size
    // - Verifies the claimed 3.7KB gzipped size
    // - Tests actual compression ratio
    // - Critical for production deployment size verification
    async testGzippedSize() {
        return new Promise((resolve, reject) => {
            try {
                const content = fs.readFileSync(this.libraryPath, 'utf8');
                const gzipped = gzipSync(content);
                const sizeKB = gzipped.length / 1024;
                
                console.log(`📦 Gzipped size: ${sizeKB.toFixed(1)}KB`);
                
                // Allow some tolerance (claimed 3.7KB, allow 3-5KB range)
                if (sizeKB >= 3 && sizeKB <= 5) {
                    console.log('✅ Gzipped size within acceptable range');
                    resolve();
                } else {
                    reject(new Error(`Gzipped size ${sizeKB.toFixed(1)}KB outside acceptable range (3-5KB)`));
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
                
                // Expect compression ratio to be reasonable (20-40%)
                if (ratio >= 20 && ratio <= 40) {
                    console.log('✅ Compression ratio is reasonable');
                    resolve();
                } else {
                    reject(new Error(`Compression ratio ${ratio.toFixed(1)}% outside reasonable range (20-40%)`));
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
}

module.exports = SizeTests; 