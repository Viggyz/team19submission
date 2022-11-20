export const encodeLocationId = (location) => {
    const mapping = {
        'way': 'W',
        'node': 'N',
        'relation': 'R',
    }
    return mapping[location.osm_type]+location.osm_id;
} 

export const backOffAPICall = (clientFunc, config, retryCondition) => {
    let count=0;
    const backoffTime = 300;
    
    function callFunction() {
        return new Promise((resolve, reject) => {
            clientFunc.apply(null, config)
            .then((data) => resolve(data))
            .catch((err) => {
                if (retryCondition(err)) {
                    if (count<3) {
                        count++;
                        setTimeout(() => {
                            arguments.callee.bind(this)()
                            .then(data => resolve(data))
                            .catch(err => reject(err))
                        }, count * backoffTime)
                    }
                }
                else {
                    reject(err);
                }
            });
        });
    };
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            callFunction.bind(this)()
            .then(data => resolve(data))
            .catch(err => reject(err))
        }, count * backoffTime)
    })
}

export const debouncedAPICall = (func) => {
    let  timer;
    return function (...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
        }, 600);
    };
  };