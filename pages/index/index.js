//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        motto: 'Please provide your bag name',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        bagName: "",
        inSearch: false,
        loopCancelling: false,
        timer: ""
    },

    bagNameInput: function (e) {
        this.setData({
            bagName: e.detail.value
        })
    },
    bindCancel: function () {
        var that = this;
        that.setData({inSearch: false});
        clearInterval(that.data.timer);
    },
    bindData: function () {
        var that = this
        that.setData({
            inSearch: (true)
        })
        //console.log(that.data.bagName)
        // while (!this.data.loopCancelling){
        var timer = setInterval(function () {
            console.log(that.data.bagName);
            wx.request({
                url: 'https://www.hermes.com/us/en/search',
                data: {
                    s: that.data.bagName
                },
                header: {
                    'content-type': 'application/json'
                },
                success(res) {
                    if (res.statusCode != '200') {
                        wx.showModal({
                            title: '请求失败',
                            content: '请输入包名！',
                        });
                        that.setData({
                            inSearch: (false)
                        });
                        clearInterval(timer)
                    }

                    var patt = /class="main-title">Oops!<\/div>/i
                    var result = res.data.match(patt)
                    if (result != null) {
//                   wx.showModal({
//                     title: '可惜了',
//                     content: '没中到包！',
//                     success(res) {
//                       if (res.confirm) {
//                         console.log('用户点击确定')
//                       } else if (res.cancel) {
//                         console.log('用户点击取消')
//                       }
//                     }
//                   })
                        wx.showToast({
                            title: '没中到包',
                            icon: 'none',
                            duration: 1000
                        })
                    } else {
                        var patt = /Abracadabra! Here are the results for(.*?)<.*? \(([0-9]*)\)/i
                        console.log(res.data)
                        result = res.data.match(patt)
                        var count = result[2]
                        var product = result[1]
                        wx.showToast({
                            title: '找到了' + count + '件关于 ' + product + '的产品，请去网站买！',
                            icon: 'none',
                            duration: 5000
                        });
                        that.setData({
                            inSearch: (false)
                        });
                        console.log(res.data.match(patt));
                        clearInterval(timer)
                    }
                    //   var that=this
                    //   WxParse.wxParse('content', 'html', res.data, that, 5);
                }
            })

        }, 5000, that);
        that.data.timer = timer;
        console.log(that.data.inSearch)

    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
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
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
