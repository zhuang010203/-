//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Welcome',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //用户点击右上角转发
  onShareAppMessage:function(e){
    console.log(e) 
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../xzq/index'
    })
  },
  onLoad: function () {
    //console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.showToast({
        title: '正在跳转...',
        icon: 'success',
        duration: 2000,
        success:function(){
          wx.navigateTo({
            url: '../xzq/index'
          })
        }
      }) 
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    /*wx.login({
      success: res1 => {
        if(res1.code){
          wx.showToast({
            title: '正在跳转...',
            icon: 'success',
            duration: 2000,
            success:function(){
              wx.navigateTo({
                url: '../xzq/index'
              })
            }
          })
        }
      }
    })*/
  },
  //获取用户信息
  getUserInfo: function(e) {
    if(e.detail.userInfo){
      //app.globalData.userInfo = e.detail.userInfo,
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.login({
        success: res1 => {
          //发送数据到后台
          wx.request({
            url: 'https://www.mylove7.top/xzq/index.php/Index/add_wx_user.html',
            data: {
              code: res1.code,
              userInfo: e.detail.userInfo
            },
            success:function(e){
              if(e.data > 0 || e.data == "ok"){
                wx.showToast({
                  title: '正在跳转...',
                  icon: 'success',
                  duration: 2000,
                  success:function(){
                    wx.navigateTo({
                      url: '../xzq/index'
                    })
                  }
                }) 
              }else{
                wx.showToast({
                  title: '授权失败！',
                  image: '../images/cuo.png',
                  duration: 5000,
                  success:function(){
                    wx.navigateTo({
                      url: '../xzq/index'
                    })
                  }
                })
              }
            }
          })
                   
        }
      }) 
    }else{
      wx.showToast({
        title: '请允许授权登录！',
        image: '../images/cuo.png',
        duration: 5000
      })
   
    }
}
})
