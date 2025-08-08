/* IMMUTABLE: THIS IS THE ONE AND ONLY COMMENT ALLOWED IN THIS FILE. DO NOT ADD ANY COMMENTS TO THIS FILE. WE NEED IT TO REMAIN AS SMALL AS POSSIBLE! ALL DOCUMENTATION BELONGS IN docs/API.md */

class WebSocketHypermedia {
    constructor(url, options = {}) {
        this.url = url;
        this.options = {
            autoReconnect: true,
            reconnectDelay: 1000,
            maxReconnectAttempts: 5,
            escapeChar: '~',
            onConnect: null,
            onDisconnect: null,
            onError: null,
            onMessage: null,
            enableLogging: true,
            maxJsonSize: 1024 * 1024,
            enableJsonValidation: false,
            maxMessageSize: 1024 * 1024,
            maxParts: 100,
            enableSecurityLogging: false,
            securityLogLevel: 'warn',
            protocolVersion: '1.1',
            requireVersion: false,
            ...options
        };
        
        this.ws = null;
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.messageHandlers = new Map();
        
        this.esc = this.options.escapeChar;
        this.actions = {
            update: (el, subject) => el.innerHTML = subject,
            append: (el, subject) => el.insertAdjacentHTML('beforeend', subject),
            prepend: (el, subject) => el.insertAdjacentHTML('afterbegin', subject),
            replace: (el, subject) => el.outerHTML = subject,
            remove: (el) => el.remove(),
            swap: (el, subject) => el.outerHTML = subject,
            before: (el, subject) => el.insertAdjacentHTML('beforebegin', subject),
            after: (el, subject) => el.insertAdjacentHTML('afterend', subject),
            addClass: (el, subject) => el.classList.add(subject),
            removeClass: (el, subject) => el.classList.remove(subject),
            toggleClass: (el, subject) => el.classList.toggle(subject),
            setAttr: (el, attrName, value) => el.setAttribute(attrName, value),
            removeAttr: (el, subject) => el.removeAttribute(subject),
            setStyle: (el, property, value) => el.style[property] = value,
            removeStyle: (el, property) => el.style.removeProperty(property),
            trigger: (el, eventType, eventData) => {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                if (eventData) {
                    try {
                        if (this.options.enableJsonValidation) {
                            this._vJson(eventData, this.options.maxJsonSize);
                        }
                        const data = JSON.parse(eventData);
                        
                        const safeData = {};
                        for (const [key, value] of Object.entries(data)) {
                            if (key !== '__proto__' && key !== 'constructor') {
                                safeData[key] = value;
                            }
                        }
                        Object.assign(event, safeData);
                    } catch (e) {
                        this._logSec('JSON parsing error', { error: e.message, eventData });
                        event.detail = eventData;
                    }
                }
                el.dispatchEvent(event);
            },
            setValue: (el, value) => el.value = value,
            setChecked: (el, checked) => el.checked = checked === 'true',
            setSelected: (el, value) => {
                if (el.multiple) {
                    const values = value.split(',');
                    Array.from(el.options).forEach(option => {
                        option.selected = values.includes(option.value);
                    });
                } else {
                    el.value = value;
                }
            },
            animate: (el, animationName, duration, easing, delay, iterations, direction, fillMode, ...options) => {
                const animation = el.animate([
                    { opacity: '0', transform: 'translateY(20px)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ], {
                    duration: duration ? parseFloat(duration) * 1000 : 1000,
                    easing: easing || 'ease',
                    delay: delay ? parseFloat(delay) * 1000 : 0,
                    iterations: iterations === 'infinite' ? Infinity : (parseInt(iterations) || 1),
                    direction: direction || 'normal',
                    fill: fillMode || 'none'
                });
                el.dataset.currentAnimation = animationName;
                el.dataset.animation = animation;
            },
            transition: (el, properties, duration, easing) => {
                el.style.transition = `${properties || 'all'} ${duration || '0.3s'} ${easing || 'ease'}`;
            },
            removeAnimation: (el) => {
                if (el.dataset.animation) {
                    el.dataset.animation.cancel();
                    delete el.dataset.animation;
                    delete el.dataset.currentAnimation;
                }
            },
            pauseAnimation: (el) => {
                if (el.dataset.animation) {
                    el.dataset.animation.pause();
                }
            },
            resumeAnimation: (el) => {
                if (el.dataset.animation) {
                    el.dataset.animation.play();
                }
            },
            getAnimationState: (el) => {
                if (el.dataset.animation) {
                    return {
                        name: el.dataset.currentAnimation,
                        playState: el.dataset.animation.playState,
                        currentTime: el.dataset.animation.currentTime
                    };
                }
                return null;
            },
            keyframe: (el, animationName, keyframes, duration) => {
                let parsedKeyframes;
                if (typeof keyframes === 'string') {
                    try {
                        if (this.options.enableJsonValidation) {
                            this._vJson(keyframes, this.options.maxJsonSize);
                        }
                        parsedKeyframes = JSON.parse(keyframes);
                    } catch (e) {
                        this._logSec('Keyframe JSON parsing error', { error: e.message, keyframes });
                        return;
                    }
                } else {
                    parsedKeyframes = keyframes;
                }
                
                const animation = el.animate(parsedKeyframes, {
                    duration: duration ? parseFloat(duration) * 1000 : 1000
                });
                el.dataset.currentAnimation = animationName;
                el.dataset.animation = animation;
            }
        };
        
        this._connect();
    }
    
    _connect() {
        if (this.isConnecting) return;
        this.isConnecting = true;
        
        try {
            this._validateWebSocketUrl(this.url);
            this.ws = new WebSocket(this.url);
            this.setupEventHandlers();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    _validateWebSocketUrl(url) {
        try {
            const urlObj = new URL(url);
            if (!['ws:', 'wss:'].includes(urlObj.protocol)) {
                throw new Error('Invalid WebSocket protocol');
            }
            return true;
        } catch (error) {
            throw new Error('Invalid WebSocket URL');
        }
    }
    
    _validateElementId(id) {
        if (typeof id !== 'string' || id.length === 0 || id.length > 100) {
            return false;
        }
        return /^[a-zA-Z0-9_-]+$/.test(id);
    }
    
    _vJson(d, s = 1024 * 1024) {
        if (d.length > s) throw new Error('JSON too large');
        if (d.includes('"__proto__"') || d.includes('"constructor"')) throw new Error('Prototype pollution');
        return true;
    }
    
    _logSec(e, d) {
        if (this.options.enableSecurityLogging) {
            const m = this.options.securityLogLevel === 'error' ? 'error' : 'warn';
            console[m](`[Security] ${e}:`, d);
        }
    }
    
    _san(v, t) {
        const s = this.options.inputSanitizers[t];
        return s ? s(v) : v;
    }
    
    _vProto(v, o) {
        if (!this.options.requireVersion) return true;
        const ver = o.find(opt => opt.startsWith('version='));
        return ver ? ver.split('=')[1] === this.options.protocolVersion : false;
    }
    
    setupEventHandlers() {
        const { onConnect, onDisconnect, onMessage } = this.options;
        
        this.ws.onopen = () => {
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            onConnect?.();
        };
        
        this.ws.onclose = (event) => {
            this.isConnecting = false;
            onDisconnect?.(event);
            
            if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
                this.scheduleReconnect();
            }
        };
        
        this.ws.onerror = (error) => {
            this.handleError(error);
        };
        
        this.ws.onmessage = async (event) => {
            await this.handleMessage(event.data);
            onMessage?.(event.data);
        };
    }
    
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.options.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        setTimeout(() => {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this._connect();
            }
        }, delay);
    }
    
    async handleMessage(data) {
        try {
            const parts = this.parseMessage(data);
            
            if (parts.length >= 3) {
                const [verb, noun, subject, ...options] = parts;
                
                if (this.options.requireVersion && !this._vProto(verb, options)) {
                    this._logSec('Protocol version mismatch', { verb, options });
                    return;
                }
                
                await this.processAction(verb, noun, subject, options);
            }
        } catch (error) {
            this._logSec('Message processing error', { error: error.message });
            if (this.options.enableLogging) {
                console.error('Error processing message:', error);
            }
        }
    }
    
    parseMessage(data) {
        if (data.length > this.options.maxMessageSize) {
            this._logSec('Message too large', { size: data.length, maxSize: this.options.maxMessageSize });
            throw new Error('Message too large');
        }
        
        const parts = [];
        let currentPart = '';
        let i = 0;
        let inEscaped = false;
        const esc = this.esc;
        const len = data.length;
        
        while (i < len) {
            const char = data[i];
            
            if (char === esc && !inEscaped) {
                inEscaped = true;
                i++;
                continue;
            } else if (char === esc && inEscaped) {
                inEscaped = false;
                i++;
                continue;
            } else if (char === '|' && !inEscaped) {
                parts.push(currentPart);
                currentPart = '';
                i++;
                
                if (parts.length > this.options.maxParts) {
                    this._logSec('Too many message parts', { parts: parts.length, maxParts: this.options.maxParts });
                    throw new Error('Too many message parts');
                }
                continue;
            }
            
            currentPart += char;
            i++;
        }
        
        if (currentPart.length > 0 || parts.length > 0) {
            parts.push(currentPart);
        }
        
        return parts;
    }
    
    async processAction(verb, noun, subject, options = []) {
        if (!this._validateElementId(noun)) {
            if (this.options.enableLogging) {
                console.warn('Invalid element ID:', noun);
            }
            return;
        }
        
        const el = document.getElementById(noun);
        
        if (!el) {
            if (this.options.enableLogging) {
                console.warn('Element not found:', noun);
            }
            return;
        }
        
        const customHandler = this.messageHandlers.get(verb);
        if (customHandler) {
            const result = customHandler(el, subject, noun, options);
            if (result && typeof result.then === 'function') {
                await result;
            }
            return;
        }
        
        const action = this.actions[verb];
        if (action) {
            if (verb === 'setAttr') {
                const attrName = subject;
                const value = options[0] || '';
                action(el, attrName, value);
            } else if (verb === 'setStyle') {
                const property = subject;
                const value = options[0] || '';
                action(el, property, value);
            } else if (verb === 'trigger') {
                const eventType = subject;
                const eventData = options[0] || '';
                action(el, eventType, eventData);
            } else if (verb === 'setValue' || verb === 'setChecked' || verb === 'setSelected') {
                const value = subject;
                action(el, value);
            } else if (verb === 'animate') {
                const animationName = subject;
                const duration = options[0] || '1s';
                const easing = options[1] || 'ease';
                const delay = options[2] || '0s';
                const iterations = options[3] || '1';
                const direction = options[4] || 'normal';
                const fillMode = options[5] || 'none';
                const remainingOptions = options.slice(6);
                action(el, animationName, duration, easing, delay, iterations, direction, fillMode, ...remainingOptions);
            } else if (verb === 'transition') {
                const properties = subject;
                const duration = options[0] || '0.3s';
                const easing = options[1] || 'ease';
                action(el, properties, duration, easing);
            } else if (verb === 'removeAnimation' || verb === 'pauseAnimation' || verb === 'resumeAnimation') {
                action(el);
            } else if (verb === 'getAnimationState') {
                const state = action(el);
                if (this.options.enableLogging) {
                    console.log('Animation state:', state);
                }
            } else if (verb === 'keyframe') {
                const animationName = subject;
                const keyframes = options[0] || '{}';
                const duration = options[1] || '1s';
                action(el, animationName, keyframes, duration);
            } else {
                action(el, subject);
            }
        } else {
            if (this.options.enableLogging) {
                console.warn('Unknown verb:', verb, '- Server can extend protocol without client updates');
            }
        }
    }
    
    send(action) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(action);
        } else {
            if (this.options.enableLogging) {
                console.warn('WebSocket not ready, state:', this.ws?.readyState);
            }
        }
    }
    
    createMessage(verb, noun, subject, ...options) {
        return [verb, noun, subject, ...options].join('|');
    }
    
    sendEscaped(verb, noun, subject, ...options) {
        const esc = this.esc;
        const escapedSubject = esc + subject + esc;
        this.send(this.createMessage(verb, noun, escapedSubject, ...options));
    }
    
    addMessageHandler(action, handler) {
        this.messageHandlers.set(action, handler);
    }
    
    removeMessageHandler(action) {
        this.messageHandlers.delete(action);
    }
    
    handleError(error) {
        if (this.options.enableLogging) {
            console.error('WebSocket Hypermedia error:', error);
        }
        this.options.onError?.(error);
    }
    
    disconnect() {
        this.ws?.close();
    }
    
    connect() {
        this._connect();
    }
    
    get readyState() {
        return this.ws?.readyState ?? WebSocket.CLOSED;
    }
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.currentScript || document.querySelector('script[src*="websocket-hypermedia.js"]');
        if (script?.dataset.url) {
            window.wsHypermedia = new WebSocketHypermedia(script.dataset.url);
        }
    });
}