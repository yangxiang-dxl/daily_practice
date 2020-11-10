class YPromise{
    //三种状态
    static PENDING = 'pending'
    static FULFILLED = 'fulfilled'
    static REJECTED = 'rejected'
    constructor(exector){
        this.status = YPromise.PENDING //初始化状态为PENDING
        this.value = null
        this.reason = null
        this.callbacks = []
        exector(this._resolve.bind(this),this._reject.bind(this))
    }
    then(onresoled,onrejected){
        return new YPromise((nextresolved,nextrejected)=>{
            this.callbacks.push({
           onresoled,
           onrejected,
           nextresolved,
           nextrejected
       })
        })
       
    }
    _resolve(val){
        if(this.status == YPromise.PENDING){
            this.status = YPromise.FULFILLED
            this.value = val
            // console.log(this.value)
            this.callbacks.map(item=>{
                this._hanler(item)
            })
        }
    }
    _reject(err){
        if(this.status == YPromise.PENDING){
            this.status = YPromise.REJECTED
            this.reason = err
            // console.log(this.reason)
            this.callbacks.map(item=>{
                
                this._hanler(item)
            })
        }
    }
    _hanler(cb){
        let {onresoled,onrejected,nextresolved,nextrejected} = cb
        if(this.status == YPromise.FULFILLED){
            let val = onresoled?onresoled(this.value):undefined
            nextresolved(val)
        }else if(this.status == YPromise.REJECTED){
            let reason = onrejected?onrejected(this.reason):undefined
            nextrejected(reason)
        }
    }
    catch(fn){
        return this.then(null,fn) 
    }
    finally(fn){
        return this.then(fn,fn)
    }
    static all(intertor){
        return new YPromise((resolve,reject)=>{
              let res= [],reason=[]
        for(let item of intertor){
            console.log('ddd',item.status)
            if(item.status == YPromise.FULFILLED){
                // console.log(item.status)
                item.then((val)=>{
                    res.push(val)
                    console.log(res)
                })
            }else if(item.status == YPromise.REJECTED){
                item.then(null,(err)=>{
                    reason.push(err)
                })
            }
        }
            resolve(res)
        })
      
    }
}

// new YPromise((resolve,reject)=>{
//     setTimeout(()=>{
//         // resolve('我成功了')
//         reject('我失败了')
//     },2000)
// }).catch((err)=>{
//     console.log(err)
// })

let p1 = new YPromise((resolve,reject)=>{
    resolve('1')
})
let p2 = new YPromise((resolve,reject)=>{
    resolve('2')
})
let p3 = new YPromise((resolve,reject)=>{
    resolve('3')
})
let p4 = new YPromise((resolve,reject)=>{
    resolve('4')
})
let p5 = new YPromise((resolve,reject)=>{
    resolve('5')
})
 console.log(YPromise.all([p1,p2,p3,p4,p5]).then(val=>{
     console.log(val)
 }) )