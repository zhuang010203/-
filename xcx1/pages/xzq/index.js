//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    windowHeight:"",
    seehotarr:"",
    seearr:"",
    topText:"",
    weiText:"",
    music_img_zqq:"",
    see_content:"",
    topTextTime:"",
    music_list:"",
    music_top:"",
    music_view_state:0,
    contFilstId:"",
    music_top_url:"",
    musicState:"",
    music_zqq_id:"",
    see_view_status:"",
    music_action_status:""
  },
  onLoad:function(){
   var that = this
   let musicStateFun = wx.createInnerAudioContext()
    //获取设备可视窗口高度
    try {
      const res = wx.getSystemInfoSync()
      //console.log(res.windowHeight)
      var windowHeight = res.windowHeight
      if(windowHeight < 650){
        var windowHeight = windowHeight + 50
      }
      //console.log(windowHeight)
      that.setData({
        windowHeight:res.windowHeight,
        musicState:musicStateFun
       })
    } catch (e) {
      // Do something when catch error
    }
    //获取评论数据&音乐列表数据
    wx.request({
      url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=index', //仅为示例，并非真实的接口地址
      success (res) {
        //console.log(res.data)
        that.data.music_top = res.data[2]
        that.setData({
          seehotarr:res.data[0],
          seearr:res.data[1],
          music_top:res.data[2],
          music_list:res.data[3],
          contFilstId:res.data[1][0]['id'],
          music_top_url:'http://103.40.240.159/xzq/public/music/'+res.data[2]['name']+'.mp3',
          see_view_status:res.data[4][1]['status'],
          music_action_status:res.data[4][0]['status']
        })
        if(that.data.music_action_status == 3){
          wx.showModal({
            title: '提示',
            content: '是否自动播放音乐？',
            success (res) {
              if (res.confirm) {
                //音乐自动播放
                that.musicStop()
				//音乐图标循环开始
				that.music_zqq(true)
                //console.log('用户点击确定')
              } else if (res.cancel) {
                wx.showToast({
                  title: '点击右上角音乐logo控制播放！',
                  icon: 'none',
                  duration: 5000
                })
                that.setData({
                  music_view_state:4
                })
                //console.log('用户点击取消')
              }
            }
          })
        }
        //console.log(that.data.music_top_url)
      }
    })  
    //逐字显示
    var str1 = "一个初学者，都沦为丑八怪了\n你还要我怎样呢，我不是个演员\n其实只为让自己的歌被更多人听见\n毫无意外的是，方圆几里内\n总有人会欣赏你喜欢你支持你的\n外面下雨了没关系，我们绅士一点\n在这一切都刚刚好的场景里\n我好像在哪见过你。"
    var str2 = "摘自网易云音乐《我好像在哪见过你》热评"
    var i= 0
    var ii = 0
    var iiii = 0
    //文字循环函数开始
    var text_time = setInterval(function(){
      iiii++
      if(iiii >= 20){
        //先循环第一部分文字
        var text = str1.substring(0, i)
        i++
        that.setData({
          topText:text,
          topTextTime:i
        })
        //第一部分文字循环完毕，循环第二部分文字
        if(text.length == str1.length){
          var text1 = str2.substring(0,ii)
          ii++
          that.setData({
            weiText:text1
          })
          if(text1.length == str2.length){
            //字数输出完毕 结束循环
            clearInterval(text_time)
          }
        }
    }
    },100)
     //评论定时刷新
     var see_i = 0
     var see_time = setInterval(function(){
       var contLen = that.data.seearr.length - 1
       var contentId = that.data.seearr[contLen]['id']
       if(contentId == 1){
        var contentId = that.data.contFilstId
       }
       var contentHotId = that.data.seehotarr['id']
       //获取刷新评论数据
       wx.request({
         url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=wx_xcx_content', //仅为示例，并非真实的接口地址
         data:{
          id: contentId,
          hotId:contentHotId
         },
         success (res) {
           //console.log(res.data)
           that.setData({
            seearr:res.data
           })
         }
       })
     },10000)
     //音乐播放失败
     musicStateFun.onError((res) => {
      wx.showToast({
        title: '播放音乐失败！',
        icon: 'none', 
        duration: 3000
      })
	  that.music_zqq(false)
	  clearInterval(that.music_zqq.music_time)
	  that.setData({
		music_img_zqq:0    
	  })
    })
    musicStateFun.onCanplay(() => {
      console.log('监听音频进入可以播放状态的事件。但不保证后面可以流畅播放')
    })
    musicStateFun.onPlay(() => {
      console.log('开始播放')
    })
    musicStateFun.onPause(() => {
      console.log('暂停播放')
      that.music_yiwai_stop()
    })
    //自然播放完毕
    musicStateFun.onEnded(function(){
	  that.data.musicState.stop()
	  //that.music_zqq(false)
	  //clearInterval(that.music_zqq.music_time)
      wx.request({
        url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=bfxys', //仅为示例，并非真实的接口地址
        data:{id:that.data.music_top.id},
        success (res) {
          //console.log(res)
          that.setData({
			music_top:res.data,
			music_top_url:'https://103.40.240.159/xzq/public/music/'+res.data['name']+'.mp3'
          })
		  that.musicStop()
        }
      }) 
    })
  },
  //生命周期回调—监听页面初次渲染完成
  onReady:function(e){
    var that = this
  },
  //生命周期回调—监听页面隐藏
  onHide:function(){
    this.data.musicState.pause()
    this.music_zqq(false)
    clearInterval(this.music_zqq.music_time)
    this.setData({
      music_view_state:3,
      music_img_zqq:0    
    })
  },
  //生命周期回调—监听页面显示
  onShow:function(e){
    if(this.data.music_view_state < 3){
      this.musicStop()
    }
  },
  //用户点击右上角转发
  onShareAppMessage:function(e){
    console.log(e) 
  },
  //用户点击右上角转发到朋友圈
  onShareTimeline:function(){
  },
  //用户点击右上角收藏
  onAddToFavorites:function(){
  },
  //监控输入框输入内容
  see_content:function(e) {
    this.setData({
      see_content:e.detail.value
    })
  },
  //点击提交评论
  see_ok:function(e) {
    var that = this
    wx.login({
      success: res => {
        if(res.code){
          if(that.data.see_content == "" || that.data.see_content == null){
            wx.showToast({
              title: '请输入内容！',
              image: '../images/cuo.png',
              duration: 3000
            })
          }else{
            //发送数据到后台
            wx.request({
              url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=add',
              data: {
                code: res.code,
                content:that.data.see_content
              },
              success:function(ee){
                //console.log(ee)
                //插入数据库成功 刷新评论
                if(ee.data > 0 && ee.data != 87014){
                  //获取评论数据&音乐列表数据
                  wx.request({
                    url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=index', //仅为示例，并非真实的接口地址
                    success (res) {
                      //console.log(res.data)
                      that.setData({
                        seehotarr:res.data[0],
                        seearr:res.data[1],
                        see_content:""
                      })
                    }
                  })
                  wx.showToast({
                    title: '评论成功！',
                    icon: 'success',
                    duration: 2000,
                  }) 
                }else if(ee.data == "no"){
                  wx.showToast({
                    title: '请先登录',
                    image: '../images/cuo.png',
                    duration: 2000,
                    success:function(){
                      wx.navigateTo({
                        url: '../index/index'
                      })
                    }
                  })
                }else if(ee.data == 87014){
                  wx.showToast({
                    title: '内容含有违法违规内容！',
                    icon: 'none',
                    duration: 3500
                  })
                }else{
                  wx.showToast({
                    title: '评论失败！',
                    image: '../images/cuo.png',
                    duration: 2000
                  })
                }
              }
            })
          }
        }
      }
    })
  },
  //点击显示音乐列表
  musicView:function(){
    //console.log(this.data.music_ok_state)
    //console.log(this.data.music_view_state)
    if(this.data.music_view_state == 0){
      this.data.musicState.play()
      this.setData({
          music_view_state:1      
      })
    }else if(this.data.music_view_state == 1){
      this.data.musicState.play()
      this.setData({
        music_view_state:2    
      })
    }else if(this.data.music_view_state == 2){
      this.data.musicState.pause()
      this.music_zqq(false)
      clearInterval(this.music_zqq.music_time)
      this.setData({
        music_view_state:3,
        music_img_zqq:0    
      })
    }else if(this.data.music_view_state == 3 && this.data.music_zqq_id == 0){
      this.music_zqq(true)
      this.data.musicState.play()
      this.setData({
        music_view_state:0  
      })
    }else if(this.data.music_view_state == 4){
      this.musicStop()
      //this.music_zqq(true)
      this.setData({
        music_view_state:0  
      })
    }
  },
  //音乐播放
  musicStop:function() {
	 console.log(this.data.music_top_url)
    //console.log(this.data.music_view_state)
    this.data.musicState.src = this.data.music_top_url
    this.data.musicState.play()
  },
  //音乐图标循环开始
  music_zqq:function(aaa){
    var that = this
    var iii = 0
    if(aaa){
      var music_time = setInterval(function(){
        iii+=10
        if(iii>=360){
          iii = 0
        }
        that.setData({
          music_img_zqq:iii,
          music_zqq_id:music_time
        })
      },100)
    }else{
      clearInterval(that.data.music_zqq_id)
      that.setData({
        music_img_zqq:0,
        music_zqq_id:""
      })
    }
  },
  //切歌
  music_qiege:function(e){
	//console.log(e)
    var that = this
	var id = e.currentTarget.dataset.id
    that.data.musicState.stop()
	//that.music_zqq(false)
	//clearInterval(that.music_zqq.music_time)
    wx.request({
      url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=huange', //仅为示例，并非真实的接口地址
      data:{id:id},
      success (res) {
        //console.log(res.data)
        that.setData({
          music_top:res.data,
          music_top_url:'https://103.40.240.159/xzq/public/music/'+res.data['name']+'.mp3'
        })
        that.musicStop()
      }
    })
  },
  //音乐列表下一页
  music_next:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    console.log(e)
    wx.request({
      url: 'https://www.zaijiahome.cn/zhuang/index.php?m=Index&a=xyy', //仅为示例，并非真实的接口地址
      data:{ksid:id},
      success (res) {
        //console.log(res.data)
        that.setData({
          music_list:res.data
        })
      }
    })
  },
  //音乐意外中断
  music_yiwai_stop:function(){
    if(this.data.music_view_state < 3){
      this.musicStop()
    }
  },
})