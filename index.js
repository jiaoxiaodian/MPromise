class MPromise {
  constructor(executor) {
    this.MPromiseState = 'pending';
    this.MPromiseResult = undefined;
    this.callbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }
  
  resolve(v) {
    if(this.MPromiseState !== 'pending') return;
    this.MPromiseState = 'fulfilled';
    this.MPromiseResult = v;
    this.callbacks.forEach(callback => {
      callback.onResolve(v);
    });
  }

  reject(r) {
    if(this.MPromiseState !== 'pending') return;
    this.MPromiseState = 'rejected';
    this.MPromiseResult = r;
    this.callbacks.forEach(callback => {
      callback.onReject(r);
    });
  }

  then(onResolve, onReject) {
    return new MPromise((resolve, reject) => {
      if(this.MPromiseState === 'fulfilled') {
        if(typeof onResolve !== 'function') return this.MPromiseResult;
        const res = onResolve(this.MPromiseResult);
        if(res instanceof MPromise) {
          // ...
        } else {
          resolve(res);
        }
      }
      if(this.MPromiseState === 'rejected') {
        if(typeof onReject !== 'function') throw this.MPromiseResult;
        onReject(this.MPromiseResult);
      }
      if(this.MPromiseState === 'pending') {
        this.callbacks.push({onResolve, onReject});
      }
    });
  }
}
