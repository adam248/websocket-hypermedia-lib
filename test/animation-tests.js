/**
 * Animation Tests for WebSocket Hypermedia
 * Tests for animation and transition features (animate, transition, etc.)
 * TDD Approach: Tests written first, then implementation
 */

const WebSocket = require('ws');

class AnimationTests {
    constructor() {
        this.ws = null;
    }

    // Animation Test: Basic Animation
    // JUSTIFICATION: Basic animation functionality
    // - Tests triggering basic CSS animations
    // - Validates the animate verb works correctly
    // - Essential for dynamic UI effects
    async testBasicAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|fadeIn|1s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('fadeIn')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Basic animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation with Duration
    // JUSTIFICATION: Duration control
    // - Tests animations with specific durations
    // - Validates duration parameter handling
    // - Important for precise timing control
    async testAnimationWithDuration() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|slideIn|2.5s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('2.5s')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation with duration test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation with Easing
    // JUSTIFICATION: Easing function support
    // - Tests animations with easing functions
    // - Validates easing parameter handling
    // - Important for smooth animations
    async testAnimationWithEasing() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|bounce|1s|ease-in-out');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('ease-in-out')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation with easing test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation with Delay
    // JUSTIFICATION: Delayed animation start
    // - Tests animations with start delays
    // - Validates delay parameter handling
    // - Important for sequenced animations
    async testAnimationWithDelay() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|fadeIn|1s|ease-out|0.5s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('0.5s')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation with delay test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Multiple Animations
    // JUSTIFICATION: Complex animation sequences
    // - Tests multiple animations on same element
    // - Validates animation chaining
    // - Important for complex UI effects
    async testMultipleAnimations() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|fadeIn|1s');
                setTimeout(() => {
                    this.ws.send('animate|test-element|slideIn|1s');
                }, 100);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('slideIn')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Multiple animations test timeout'));
            }, 5000);
        });
    }

    // Animation Test: CSS Transition
    // JUSTIFICATION: CSS transition support
    // - Tests CSS transition property setting
    // - Validates transition verb functionality
    // - Important for smooth property changes
    async testCssTransition() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('transition|test-element|all|0.3s|ease');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('transition') && message.includes('all')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('CSS transition test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Transition with Properties
    // JUSTIFICATION: Specific property transitions
    // - Tests transitions on specific properties
    // - Validates property-specific transitions
    // - Important for targeted animations
    async testTransitionWithProperties() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('transition|test-element|opacity,transform|0.5s|ease-in');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('transition') && message.includes('opacity,transform')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Transition with properties test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Remove Animation
    // JUSTIFICATION: Animation removal
    // - Tests removing animations from elements
    // - Validates animation cleanup
    // - Important for animation management
    async testRemoveAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('removeAnimation|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeAnimation')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Remove animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Pause Animation
    // JUSTIFICATION: Animation control
    // - Tests pausing running animations
    // - Validates animation pause functionality
    // - Important for user interaction
    async testPauseAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('pauseAnimation|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('pauseAnimation')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Pause animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Resume Animation
    // JUSTIFICATION: Animation control
    // - Tests resuming paused animations
    // - Validates animation resume functionality
    // - Important for user interaction
    async testResumeAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('resumeAnimation|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('resumeAnimation')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Resume animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation State
    // JUSTIFICATION: Animation state management
    // - Tests checking animation state
    // - Validates animation state queries
    // - Important for animation coordination
    async testAnimationState() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('getAnimationState|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animationState')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation state test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Keyframe Animation
    // JUSTIFICATION: Custom keyframe animations
    // - Tests custom keyframe animations
    // - Validates keyframe definition handling
    // - Important for complex animations
    async testKeyframeAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('keyframe|test-element|customAnimation|{"0%": {"opacity": "0"}, "100%": {"opacity": "1"}}|2s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('keyframe') && message.includes('customAnimation')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Keyframe animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Transform Animation
    // JUSTIFICATION: Transform-based animations
    // - Tests transform property animations
    // - Validates transform animation handling
    // - Important for movement animations
    async testTransformAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|rotate|1s|ease-in-out|0s|360deg');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('rotate')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Transform animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Scale Animation
    // JUSTIFICATION: Scale-based animations
    // - Tests scale transform animations
    // - Validates scale animation handling
    // - Important for size change animations
    async testScaleAnimation() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|scale|0.5s|ease-out|0s|1.2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('scale')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Scale animation test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Color Transition
    // JUSTIFICATION: Color-based transitions
    // - Tests color property transitions
    // - Validates color transition handling
    // - Important for visual feedback
    async testColorTransition() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('transition|test-element|background-color|0.3s|ease');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('transition') && message.includes('background-color')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Color transition test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation Loop
    // JUSTIFICATION: Looping animations
    // - Tests infinite animation loops
    // - Validates loop parameter handling
    // - Important for continuous effects
    async testAnimationLoop() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|pulse|1s|ease-in-out|0s|infinite');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('infinite')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation loop test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation Direction
    // JUSTIFICATION: Animation direction control
    // - Tests animation direction (normal, reverse, alternate)
    // - Validates direction parameter handling
    // - Important for animation variety
    async testAnimationDirection() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|slideIn|1s|ease|0s|3|alternate');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('alternate')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation direction test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation Fill Mode
    // JUSTIFICATION: Animation fill mode control
    // - Tests animation fill mode (forwards, backwards, both)
    // - Validates fill mode parameter handling
    // - Important for animation state preservation
    async testAnimationFillMode() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|fadeIn|1s|ease|0s|1|normal|forwards');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('forwards')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation fill mode test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Non-existent Element
    // JUSTIFICATION: Error handling
    // - Tests animation on non-existent elements
    // - Validates graceful error handling
    // - Important for robust applications
    async testAnimationNonExistentElement() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|non-existent-element|fadeIn|1s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Element not found')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation non-existent element test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Invalid Element ID
    // JUSTIFICATION: Input validation
    // - Tests animation with invalid element IDs
    // - Validates ID format validation
    // - Important for security and robustness
    async testAnimationInvalidElementId() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|invalid@id|fadeIn|1s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('Invalid element ID')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation invalid element ID test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Long Animation Name
    // JUSTIFICATION: Performance and limits
    // - Tests animations with very long names
    // - Validates performance with long inputs
    // - Important for scalability
    async testLongAnimationName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                const longName = 'a'.repeat(100);
                this.ws.send(`animate|test-element|${longName}|1s`);
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('test-element')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Long animation name test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Unicode Animation Name
    // JUSTIFICATION: Internationalization
    // - Tests animations with unicode names
    // - Validates international character support
    // - Important for global applications
    async testUnicodeAnimationName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|动画效果|1s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('test-element')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Unicode animation name test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Escaped Animation Name
    // JUSTIFICATION: Escape mechanism
    // - Tests animations with escape characters
    // - Validates escape mechanism works for animation names
    // - Important for special character handling
    async testEscapedAnimationName() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|~fade-in | & slide-out~|1s');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('test-element')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Escaped animation name test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation with Options
    // JUSTIFICATION: Protocol extension
    // - Tests animations with additional options
    // - Validates protocol extension capability
    // - Important for extensible functionality
    async testAnimationWithOptions() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('animate|test-element|fadeIn|1s|ease|0s|1|normal|forwards|option1|option2');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') && message.includes('fadeIn')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation with options test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation Sequence
    // JUSTIFICATION: Real-world use case
    // - Tests sequencing multiple animations
    // - Validates practical application
    // - Important for complex UI effects
    async testAnimationSequence() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('sequence_animation|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') || message.includes('transition')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation sequence test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation Performance
    // JUSTIFICATION: Performance monitoring
    // - Tests animation performance monitoring
    // - Validates practical application
    // - Important for animation optimization
    async testAnimationPerformance() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('performance_animation|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('animate') || message.includes('performance')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation performance test timeout'));
            }, 5000);
        });
    }

    // Animation Test: Animation Cleanup
    // JUSTIFICATION: Resource management
    // - Tests animation cleanup and resource management
    // - Validates practical application
    // - Important for memory management
    async testAnimationCleanup() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:8765');
            
            this.ws.on('open', () => {
                this.ws.send('cleanup_animation|test-element');
            });
            
            this.ws.on('message', (data) => {
                const message = data.toString();
                if (message.includes('removeAnimation') || message.includes('cleanup')) {
                    this.ws.close();
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Animation cleanup test timeout'));
            }, 5000);
        });
    }
}

module.exports = AnimationTests; 