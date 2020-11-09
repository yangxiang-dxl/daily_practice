// class MPromise{
//     static pending = 'pending' //等待状态
//     static fulfilled = 'fulfilled'  //成功状态
//     static rejected = 'rejected' //失败状态
//     constructor(fn){
//         this.status = MPromise.pending
//         this.value = undefined //保留this._resolve 继成功的值
//         this.reason  = undefined //保留this._reject 失败的值
//         //存储then中传入的参数
//         this.callbacks = []  //链式调用时then会传入多个参数
//         fn(this._resolve.bind(this),this._reject.bind(this)) 
//     }
//     then(onresolved,onrejected){  //成功的回调和失败的回调
//         //可以理解为发布订阅模式中的事件注册
//         this.callbacks.push({
//             onrejected,onresolved
//         })
//     }
//     _resolve(value){
//         this.value = value 
//         this.status = MPromise.fulfilled 
//         this._handleCallBack()

//     }
//     _reject(reason){
//         this.reason = reason
//         this.status = MPromise.rejected
//         this._handleCallBack()
//     }
//     _handleCallBack(){
//         this.callbacks.map(cb=>{
//             let {onrejected,onresolved} = cb
//             if(this.status == MPromise.fulfilled){
//                 onresolved(this.value)
//             }else if(this.status == MPromise.rejected){
//                 onrejected(this.reason)
//             }
//         })
//     } 
// }
// function a(){
//    return  new MPromise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('我是成功的1')
//         // reject('我是失败的')
//     },1000)
// })
// }


// class MPromise{
//     static pending = 'pending' //等待状态
//     static fulfilled = 'fulfilled'  //成功状态
//     static rejected = 'rejected' //失败状态
//     constructor(fn){
//         this.status = MPromise.pending
//         this.value = undefined //保留this._resolve 继成功的值
//         this.reason  = undefined //保留this._reject 失败的值
//         //存储then中传入的参数
//         this.callbacks = []  //链式调用时then会传入多个参数
//         fn(this._resolve.bind(this),this._reject.bind(this)) 
//     }
//     then(onresolved,onrejected){  //成功的回调和失败的回调
//         //可以理解为发布订阅模式中的事件注册
//         return new MPromise((nextresolve,nextreject)=>{
//              this.callbacks.push({
//             onrejected,onresolved,nextresolve,nextreject
//         })
//         })
       
//     }
//     _resolve(value){
//         this.value = value 
//         this.status = MPromise.fulfilled 
//         this._handleCallBack()

//     }
//     _reject(reason){
//         this.reason = reason
//         this.status = MPromise.rejected
//         this._handleCallBack()
//     }
//     _handleCallBack(){
//         this.callbacks.map(cb=>{
//             let {onrejected,onresolved,nextresolve,nextreject} = cb
//             if(this.status == MPromise.fulfilled){
//                let nextvalue = onresolved? onresolved(this.value):undefined
//                nextresolve(nextvalue)
//             }else if(this.status == MPromise.rejected){
//                 let err =onrejected? onrejected(this.reason):undefined
//                 nextreject(err)
//             }
//         })
//     } 
// }
// function a(){
//    return  new MPromise((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('我是成功的1')
//         // reject('我是失败的')
//     },1000)
// })
// }
// a().then(val=>{
//     console.log(val)
//     setTimeout(()=>{
//         return '我是成功2'
//     },5000)
    
// }).then(val=>{
//     console.log(val)
// })

class YPromise{
    static pending = 'pending'
    static fulfilled = 'fulfilled'
    static rejected = 'rejected'
    static all = (iterable)=>{
        return new Promise((resolve,reject)=>{
            let res = [] , reason = []
            for (let item of iterable){
                item.then((val)=>{
                    res.push(val)
                },err=>{
                    reason.push(err)
                })
            }
            
            if(!reason){
                reject(reason)
            }else{
                resolve(res)
            }
        })
    }
  
    constructor(fn){
        this.value = undefined //保存成功的值
        this.reason = undefined //保存失败的原因
        this.callbacks = []  //存储then的参数
        this.status = YPromise.pending //初始化状态 为pending
        fn(this._resolve.bind(this),this._reject.bind(this))
    }
    then(onresolved,onrejected){
        return new YPromise((nextresolve,nextreject)=>{
            this.callbacks.push({
                onresolved,
                onrejected,
                nextresolve,
                nextreject
            })
        })
    }
    catch(onrejected){
        return this.then(null,onrejected)
    }
    finally(onfinally){
        return this.then(onfinally,onfinally)
    }
    _reject(reason){
        this.status = YPromise.rejected
        this.reason = reason
        this.callbacks.map(cb=>{
            this._handleCallBack(cb)
        })
    }
    _resolve(value){
        this.status = YPromise.fulfilled
        this.value = value
        this.callbacks.map(cb=>{
            this._handleCallBack(cb)
        })
    }
    _handleCallBack(cb){
        let {onresolved,onrejected,nextresolve,nextreject} = cb
        if(this.status ==YPromise.rejected){
            let reason =onrejected? onrejected(this.reason):undefined
            nextreject(reason)
        }else if(this.status ==YPromise.fulfilled){
            let val  = onresolved?onresolved(this.value):undefined
            nextresolve(val)
        }
    }
}

// new YPromise((resolve,reject)=>{
//     setTimeout(()=>{
//         reject('我是错误')
//     },2000)
// }).catch((err)=>{
//     console.log(err)
//     return '我是finally'
// }).finally((val)=>{
//     console.log(val)
// })

let p1 = new Promise((resolve,reject)=>{
    resolve(1)
})
let p2 = new Promise((resolve,reject)=>{
    resolve(2)
})
let p3 = new Promise((resolve,reject)=>{
    resolve(3)
})
let p4 = new Promise((resolve,reject)=>{
    resolve(4)
})
let all = YPromise.all([p1,p2,p3,p4]).then(val=>{
    console.log(val)
})
