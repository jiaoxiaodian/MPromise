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
    if (this.MPromiseState !== 'pending') return;
    this.MPromiseState = 'fulfilled';
    this.MPromiseResult = v;
    this.callbacks.forEach(callback => {
      callback.onResolve(v);
    });
  }

  reject(r) {
    if (this.MPromiseState !== 'pending') return;
    this.MPromiseState = 'rejected';
    this.MPromiseResult = r;
    this.callbacks.forEach(callback => {
      callback.onReject(r);
    });
  }

  then(onResolve, onReject) {
    return new MPromise((resolve, reject) => {
      const thenCallback = cb => {
        try {
          const res = cb(this.MPromiseResult);
          if (res instanceof MPromise) {
            // 如果返回值是promise对象，返回值为成功，新promise就是成功;返回值为失败，新promise就是失败
            res.then(resolve, reject);
          } else {
            // 如果返回值非promise对象，新promise对象就是成功，值为此返回值
            resolve(res);
          }
        } catch (e) {
          reject(e);
        }
      }

      if (this.MPromiseState === 'fulfilled') {
        thenCallback(onResolve);
      }
      if (this.MPromiseState === 'rejected') {
        thenCallback(onReject);
      }
      if (this.MPromiseState === 'pending') {
        this.callbacks.push({
          onResolve: thenCallback.bind(this, onResolve),
          onReject: thenCallback.bind(this, onReject)
        });
      }
    });
  }
}
