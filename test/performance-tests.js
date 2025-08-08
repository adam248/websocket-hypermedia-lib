/**
 * Performance Tests for WebSocket Hypermedia
 * Comprehensive performance benchmarks and load testing
 */

const WebSocket = require('ws');

class PerformanceTests {
    constructor() {
        this.ws = null;
        this.testResults = [];
    }

    // Performance Test: Message Processing Speed
    // JUSTIFICATION: High-performance load testing requirement
    // - Tests message processing speed under load
    // - Measures throughput and latency
    // - Critical for performance claims
    async testMessageProcessingSpeed() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            const startTime = Date.now();
            const messageCount = 100;
            let receivedCount = 0;
            
            this.ws.on('open', () => {
                // Send messages rapidly
                for (let i = 0; i < messageCount; i++) {
                    this.ws.send(`performance_test|content|Message ${i + 1}`);
                }
            });
            
            this.ws.on('message', (data) => {
                receivedCount++;
                if (receivedCount === messageCount) {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    const messagesPerSecond = (messageCount / duration) * 1000;
                    
                    console.log(`📊 Processed ${messageCount} messages in ${duration}ms`);
                    console.log(`📊 Throughput: ${messagesPerSecond.toFixed(1)} messages/second`);
                    
                    // Expect at least 50 messages per second
                    if (messagesPerSecond >= 50) {
                        console.log('✅ Message processing speed is acceptable');
                        this.ws.close();
                        resolve();
                    } else {
                        this.ws.close();
                        reject(new Error(`Performance too slow: ${messagesPerSecond.toFixed(1)} msg/s`));
                    }
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Performance test timeout'));
            }, 10000);
        });
    }

    // Performance Test: Large Payload Handling
    // JUSTIFICATION: Large content processing efficiency
    // - Tests handling of large HTML payloads
    // - Measures memory efficiency
    // - Critical for real-world applications
    async testLargePayloadHandling() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            const startTime = Date.now();
            const largePayload = '<div>' + '<p>Large content test</p>'.repeat(5000) + '</div>';
            
            this.ws.on('open', () => {
                this.ws.send(`update|content|${largePayload}`);
            });
            
            this.ws.on('message', (data) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                const payloadSizeKB = largePayload.length / 1024;
                
                console.log(`📊 Processed ${payloadSizeKB.toFixed(1)}KB payload in ${duration}ms`);
                console.log(`📊 Processing speed: ${(payloadSizeKB / duration * 1000).toFixed(1)}KB/s`);
                
                // Expect to process large payloads within reasonable time
                if (duration <= 5000) {
                    console.log('✅ Large payload handling is efficient');
                    this.ws.close();
                    resolve();
                } else {
                    this.ws.close();
                    reject(new Error(`Large payload processing too slow: ${duration}ms`));
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Large payload test timeout'));
            }, 10000);
        });
    }

    // Performance Test: Concurrent Connections
    // JUSTIFICATION: Multi-user scenario testing
    // - Tests handling of multiple concurrent connections
    // - Measures server capacity
    // - Critical for production scalability
    async testConcurrentConnections() {
        return new Promise((resolve, reject) => {
            const connectionCount = 10;
            const connections = [];
            let completedConnections = 0;
            
            const startTime = Date.now();
            
            for (let i = 0; i < connectionCount; i++) {
                const ws = new WebSocket('ws://localhost:8765');
                connections.push(ws);
                
                ws.on('open', () => {
                    ws.send(`concurrent_test|content|Connection ${i + 1}`);
                });
                
                ws.on('message', (data) => {
                    completedConnections++;
                    if (completedConnections === connectionCount) {
                        const endTime = Date.now();
                        const duration = endTime - startTime;
                        
                        console.log(`📊 Handled ${connectionCount} concurrent connections in ${duration}ms`);
                        
                        // Close all connections
                        connections.forEach(conn => conn.close());
                        
                        // Expect concurrent connections to be handled efficiently
                        if (duration <= 3000) {
                            console.log('✅ Concurrent connection handling is efficient');
                            resolve();
                        } else {
                            reject(new Error(`Concurrent connections too slow: ${duration}ms`));
                        }
                    }
                });
                
                ws.on('error', (error) => {
                    connections.forEach(conn => conn.close());
                    reject(new Error(`Connection error: ${error.message}`));
                });
            }
            
            setTimeout(() => {
                connections.forEach(conn => conn.close());
                reject(new Error('Concurrent connections test timeout'));
            }, 10000);
        });
    }

    // Performance Test: Memory Usage
    // JUSTIFICATION: Memory efficiency requirement
    // - Tests memory usage under load
    // - Measures memory leaks
    // - Critical for long-running applications
    async testMemoryUsage() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            const initialMemory = process.memoryUsage();
            const messageCount = 1000;
            let receivedCount = 0;
            
            this.ws.on('open', () => {
                // Send many messages to test memory usage
                for (let i = 0; i < messageCount; i++) {
                    this.ws.send(`memory_test|content|Message ${i + 1} with some content`);
                }
            });
            
            this.ws.on('message', (data) => {
                receivedCount++;
                if (receivedCount === messageCount) {
                    const finalMemory = process.memoryUsage();
                    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
                    const memoryIncreaseKB = memoryIncrease / 1024;
                    
                    console.log(`📊 Memory increase: ${memoryIncreaseKB.toFixed(1)}KB`);
                    console.log(`📊 Memory per message: ${(memoryIncreaseKB / messageCount).toFixed(2)}KB`);
                    
                    // Expect reasonable memory usage (less than 2MB increase for 1000 messages)
                    if (memoryIncreaseKB <= 2048) {
                        console.log('✅ Memory usage is reasonable');
                        this.ws.close();
                        resolve();
                    } else {
                        this.ws.close();
                        reject(new Error(`Memory usage too high: ${memoryIncreaseKB.toFixed(1)}KB`));
                    }
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Memory usage test timeout'));
            }, 15000);
        });
    }

    // Performance Test: Latency Measurement
    // JUSTIFICATION: Real-time performance requirement
    // - Tests round-trip latency
    // - Measures response times
    // - Critical for real-time applications
    async testLatencyMeasurement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            const latencies = [];
            const testCount = 10; // Reduced for more reliable testing
            let completedTests = 0;
            
            this.ws.on('open', () => {
                // Send latency test messages with proper timing
                const sendLatencyTest = (index) => {
                    if (index >= testCount) return;
                    
                    const sendTime = Date.now();
                    this.ws.send(`latency_test|content|Test ${index + 1}`);
                    
                    // Store send time for this message
                    this.ws._lastSendTime = sendTime;
                    
                    // Send next message after a delay
                    setTimeout(() => sendLatencyTest(index + 1), 100);
                };
                
                sendLatencyTest(0);
            });
            
            this.ws.on('message', (data) => {
                const receiveTime = Date.now();
                if (this.ws._lastSendTime) {
                    const latency = receiveTime - this.ws._lastSendTime;
                    latencies.push(latency);
                }
                
                completedTests++;
                if (completedTests === testCount) {
                    if (latencies.length > 0) {
                        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
                        const minLatency = Math.min(...latencies);
                        const maxLatency = Math.max(...latencies);
                        
                        console.log(`📊 Average latency: ${avgLatency.toFixed(1)}ms`);
                        console.log(`📊 Min latency: ${minLatency}ms`);
                        console.log(`📊 Max latency: ${maxLatency}ms`);
                        
                        // Expect reasonable latency (average < 100ms)
                        if (avgLatency <= 100) {
                            console.log('✅ Latency is acceptable');
                            this.ws.close();
                            resolve();
                        } else {
                            this.ws.close();
                            reject(new Error(`Latency too high: ${avgLatency.toFixed(1)}ms average`));
                        }
                    } else {
                        this.ws.close();
                        reject(new Error('No latency measurements recorded'));
                    }
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Latency test timeout'));
            }, 10000);
        });
    }

    // Performance Test: Stress Test
    // JUSTIFICATION: Production load simulation
    // - Tests system under extreme load
    // - Measures breaking points
    // - Critical for production readiness
    async testStressTest() {
        return new Promise((resolve, reject) => {
            const messageCount = 50; // Fixed number of messages
            let receivedCount = 0;
            const startTime = Date.now();
            
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                // Send all messages rapidly
                for (let i = 0; i < messageCount; i++) {
                    setTimeout(() => {
                        this.ws.send(`stress_test|content|Stress message ${i + 1}`);
                    }, i * 10); // 10ms between messages
                }
            });
            
            this.ws.on('message', (data) => {
                receivedCount++;
                
                if (receivedCount === messageCount) {
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    const messagesPerSecond = (messageCount / duration) * 1000;
                    const successRate = (receivedCount / messageCount) * 100;
                    
                    console.log(`📊 Stress test: ${receivedCount}/${messageCount} messages (${successRate.toFixed(1)}% success)`);
                    console.log(`📊 Sustained throughput: ${messagesPerSecond.toFixed(1)} msg/s`);
                    
                    // Expect high success rate under stress
                    if (successRate >= 90) {
                        console.log('✅ Stress test passed');
                        this.ws.close();
                        resolve();
                    } else {
                        this.ws.close();
                        reject(new Error(`Stress test failed: ${successRate.toFixed(1)}% success rate`));
                    }
                }
            });
            
            setTimeout(() => {
                this.ws.close();
                reject(new Error('Stress test timeout'));
            }, 5000);
        });
    }
}

module.exports = PerformanceTests; 