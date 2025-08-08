/* IMMUTABLE: THIS IS THE ONE AND ONLY COMMENT ALLOWED IN THIS FILE. DO NOT ADD ANY COMMENTS TO THIS FILE. WE NEED IT TO REMAIN AS SMALL AS POSSIBLE! ALL DOCUMENTATION BELONGS IN docs/API.md */

class WebSocketHypermedia {
    constructor(url, o = {}) {
        this.url = url;
        this.o = {
            autoReconnect: 1,
            reconnectDelay: 1000,
            maxReconnectAttempts: 5,
            escapeChar: '~',
            onConnect: null,
            onDisconnect: null,
            onError: null,
            onMessage: null,
            enableLogging: 1,
            maxJsonSize: 1024 * 1024,
            enableJsonValidation: 0,
            maxMessageSize: 1024 * 1024,
            maxParts: 100,
            enableSecurityLogging: 0,
            securityLogLevel: 'warn',
            protocolVersion: '1.1',
            requireVersion: 0,
            ...o
        };
        
        this.ws = null;
        this.reconnectAttempts = 0;
        this.isConnecting = 0;
        this.handlers = new Map();
        this.esc = this.o.escapeChar;
        
        const a = this.actions = {
            update: (e, s) => e.innerHTML = s,
            append: (e, s) => e.insertAdjacentHTML('beforeend', s),
            prepend: (e, s) => e.insertAdjacentHTML('afterbegin', s),
            replace: (e, s) => e.outerHTML = s,
            remove: e => e.remove(),
            swap: (e, s) => e.outerHTML = s,
            before: (e, s) => e.insertAdjacentHTML('beforebegin', s),
            after: (e, s) => e.insertAdjacentHTML('afterend', s),
            addClass: (e, s) => e.classList.add(s),
            removeClass: (e, s) => e.classList.remove(s),
            toggleClass: (e, s) => e.classList.toggle(s),
            setAttr: (e, n, v) => e.setAttribute(n, v),
            removeAttr: (e, s) => e.removeAttribute(s),
            setStyle: (e, p, v) => e.style[p] = v,
            removeStyle: (e, p) => e.style.removeProperty(p),
            trigger: (e, t, d) => {
                const ev = new Event(t, { bubbles: 1, cancelable: 1 });
                if (d) {
                    try {
                        if (this.o.enableJsonValidation) this._vJson(d, this.o.maxJsonSize);
                        const data = JSON.parse(d);
                        const safe = {};
                        for (const [k, v] of Object.entries(data)) {
                            if (k !== '__proto__' && k !== 'constructor') safe[k] = v;
                        }
                        Object.assign(ev, safe);
                    } catch (err) {
                        this._logSec('JSON parsing error', { error: err.message, eventData: d });
                        ev.detail = d;
                    }
                }
                e.dispatchEvent(ev);
            },
            setValue: (e, v) => e.value = v,
            setChecked: (e, c) => e.checked = c === 'true',
            setSelected: (e, v) => {
                if (e.multiple) {
                    const vals = v.split(',');
                    Array.from(e.options).forEach(o => o.selected = vals.includes(o.value));
                } else e.value = v;
            },
            animate: (e, n, d, es, dl, it, dir, fill, ...opts) => {
                const anim = e.animate([
                    { opacity: '0', transform: 'translateY(20px)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ], {
                    duration: d ? parseFloat(d) * 1000 : 1000,
                    easing: es || 'ease',
                    delay: dl ? parseFloat(dl) * 1000 : 0,
                    iterations: it === 'infinite' ? Infinity : (parseInt(it) || 1),
                    direction: dir || 'normal',
                    fill: fill || 'none'
                });
                e.dataset.currentAnimation = n;
                e.dataset.animation = anim;
            },
            transition: (e, p, d, es) => e.style.transition = `${p || 'all'} ${d || '0.3s'} ${es || 'ease'}`,
            removeAnimation: e => {
                if (e.dataset.animation) {
                    e.dataset.animation.cancel();
                    delete e.dataset.animation;
                    delete e.dataset.currentAnimation;
                }
            },
            pauseAnimation: e => e.dataset.animation?.pause(),
            resumeAnimation: e => e.dataset.animation?.play(),
            getAnimationState: e => e.dataset.animation ? {
                name: e.dataset.currentAnimation,
                playState: e.dataset.animation.playState,
                currentTime: e.dataset.animation.currentTime
            } : null,
            keyframe: (e, n, k, d) => {
                let parsed;
                if (typeof k === 'string') {
                    try {
                        if (this.o.enableJsonValidation) this._vJson(k, this.o.maxJsonSize);
                        parsed = JSON.parse(k);
                    } catch (err) {
                        this._logSec('Keyframe JSON parsing error', { error: err.message, keyframes: k });
                        return;
                    }
                } else parsed = k;
                
                const anim = e.animate(parsed, { duration: d ? parseFloat(d) * 1000 : 1000 });
                e.dataset.currentAnimation = n;
                e.dataset.animation = anim;
            }
        };
        
        this.specialVerbs = {
            setAttr: (action, el, subject, options) => action(el, subject, options[0] || ''),
            setStyle: (action, el, subject, options) => action(el, subject, options[0] || ''),
            trigger: (action, el, subject, options) => action(el, subject, options[0] || ''),
            setValue: (action, el, subject) => action(el, subject),
            setChecked: (action, el, subject) => action(el, subject),
            setSelected: (action, el, subject) => action(el, subject),
            animate: (action, el, subject, options) => action(el, subject, options[0] || '1s', options[1] || 'ease', options[2] || '0s', options[3] || '1', options[4] || 'normal', options[5] || 'none', ...options.slice(6)),
            transition: (action, el, subject, options) => action(el, subject, options[0] || '0.3s', options[1] || 'ease'),
            removeAnimation: (action, el) => action(el),
            pauseAnimation: (action, el) => action(el),
            resumeAnimation: (action, el) => action(el),
            getAnimationState: (action, el) => action(el),
            keyframe: (action, el, subject, options) => action(el, subject, options[0] || '{}', options[1] || '1s')
        };
        
        this._connect();
    }
    
    _connect() {
        if (this.isConnecting) return;
        this.isConnecting = 1;
        
        try {
            this._validateUrl(this.url);
            this.ws = new WebSocket(this.url);
            this._setupHandlers();
        } catch (err) {
            this._handleError(err);
        }
    }
    
    _validateUrl(url) {
        try {
            const u = new URL(url);
            if (!['ws:', 'wss:'].includes(u.protocol)) throw new Error('Invalid WebSocket protocol');
            return 1;
        } catch {
            throw new Error('Invalid WebSocket URL');
        }
    }
    
    _validateId(id) {
        return typeof id === 'string' && id.length > 0 && id.length <= 100 && /^[a-zA-Z0-9_-]+$/.test(id);
    }
    
    _vJson(d, s = 1024 * 1024) {
        if (d.length > s) throw new Error('JSON too large');
        if (d.includes('"__proto__"') || d.includes('"constructor"')) throw new Error('Prototype pollution');
        return 1;
    }
    
    _logSec(e, d) {
        if (this.o.enableSecurityLogging) {
            const m = this.o.securityLogLevel === 'error' ? 'error' : 'warn';
            console[m](`[Security] ${e}:`, d);
        }
    }
    
    _vProto(v, o) {
        if (!this.o.requireVersion) return 1;
        const ver = o.find(opt => opt.startsWith('version='));
        return ver ? ver.split('=')[1] === this.o.protocolVersion : 0;
    }
    
    _setupHandlers() {
        const { onConnect, onDisconnect, onMessage } = this.o;
        
        this.ws.onopen = () => {
            this.isConnecting = 0;
            this.reconnectAttempts = 0;
            onConnect?.();
        };
        
        this.ws.onclose = (ev) => {
            this.isConnecting = 0;
            onDisconnect?.(ev);
            
            if (this.o.autoReconnect && this.reconnectAttempts < this.o.maxReconnectAttempts) {
                this._scheduleReconnect();
            }
        };
        
        this.ws.onerror = (err) => this._handleError(err);
        
        this.ws.onmessage = async (ev) => {
            await this._handleMessage(ev.data);
            onMessage?.(ev.data);
        };
    }
    
    _scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.o.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        setTimeout(() => {
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this._connect();
            }
        }, delay);
    }
    
    async _handleMessage(data) {
        try {
            const parts = this._parseMessage(data);
            
            if (parts.length >= 3) {
                const [verb, noun, subject, ...options] = parts;
                
                if (this.o.requireVersion && !this._vProto(verb, options)) {
                    this._logSec('Protocol version mismatch', { verb, options });
                    return;
                }
                
                await this._processAction(verb, noun, subject, options);
            }
        } catch (err) {
            this._logSec('Message processing error', { error: err.message });
            if (this.o.enableLogging) console.error('Error processing message:', err);
        }
    }
    
    _parseMessage(data) {
        if (data.length > this.o.maxMessageSize) {
            this._logSec('Message too large', { size: data.length, maxSize: this.o.maxMessageSize });
            throw new Error('Message too large');
        }
        
        const parts = [];
        let current = [];
        let i = 0;
        let escaped = 0;
        const esc = this.esc;
        const len = data.length;
        
        while (i < len) {
            const char = data[i];
            
            if (char === esc && !escaped) {
                escaped = 1;
                i++;
                continue;
            } else if (char === esc && escaped) {
                escaped = 0;
                i++;
                continue;
            } else if (char === '|' && !escaped) {
                parts.push(current.join(''));
                current = [];
                i++;
                
                if (parts.length > this.o.maxParts) {
                    this._logSec('Too many message parts', { parts: parts.length, maxParts: this.o.maxParts });
                    throw new Error('Too many message parts');
                }
                continue;
            }
            
            current.push(char);
            i++;
        }
        
        parts.push(current.join(''));
        return parts;
    }
    
    async _processAction(verb, noun, subject, options = []) {
        if (!this._validateId(noun)) {
            if (this.o.enableLogging) console.warn('Invalid element ID:', noun);
            return;
        }
        
        const el = document.getElementById(noun);
        if (!el) {
            if (this.o.enableLogging) console.warn('Element not found:', noun);
            return;
        }
        
        const custom = this.handlers.get(verb);
        if (custom) {
            const result = custom(el, subject, noun, options);
            if (result?.then) await result;
            return;
        }
        
        const action = this.actions[verb];
        if (action) {
            const special = this.specialVerbs[verb];
            if (special) special(action, el, subject, options);
            else action(el, subject);
        } else if (this.o.enableLogging) {
            console.warn('Unknown verb:', verb, '- Server can extend protocol without client updates');
        }
    }
    
    send(action) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(action);
        } else if (this.o.enableLogging) {
            console.warn('WebSocket not ready, state:', this.ws?.readyState);
        }
    }
    
    createMessage(verb, noun, subject, ...options) {
        return [verb, noun, subject, ...options].join('|');
    }
    
    sendEscaped(verb, noun, subject, ...options) {
        this.send(this.createMessage(verb, noun, this.esc + subject + this.esc, ...options));
    }
    
    addMessageHandler(action, handler) {
        this.handlers.set(action, handler);
    }
    
    removeMessageHandler(action) {
        this.handlers.delete(action);
    }
    
    _handleError(err) {
        if (this.o.enableLogging) console.error('WebSocket Hypermedia error:', err);
        this.o.onError?.(err);
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