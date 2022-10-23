var WorkShopID;
var inCourseId;
var inLessonId;
//var type;
var IsStop = true;
var yxsj = 0;
var zsj = 0;
var NexShowTime = 120; //未答或答错：下次弹出题目设为180秒。
var ReplyID;
var allormy = 0;
var score = 0;
$(function () {
  theTopNav_Front.GetUserInfoTo();

  $("#back_courselist").click(function () {
    var myurl = GetQueryString("refurl");
    if (myurl != null && myurl.toString().length > 1) {
      if (confirm("是否停止学习，返回课程列表？")) {
        LearnningManage.Stop(WorkShopID, inCourseId, inLessonId, 0);
        IsStop = false;
        setTimeout(function () {
          window.location.href = myurl;
        }, 1000);
      }
    }
  });
  //type = GetQueryString("type");
  inLessonId = GetQueryString("inLessonId");
  inCourseId = GetQueryString("inCourseId");
  WorkShopID = GetQueryString("WorkShopID");

  GetCoursewareDetails(inLessonId);
  getuseressay(WorkShopID, inCourseId, inLessonId);
  $("#btn_sub").click(function () {
    var tarea_essay = $("#tarea_essay").val();
    if (tarea_essay.replace(/(^\s+)|(\s+$)/g, "") == "") {
      alert("随笔不能为空。");
      return;
    }
    var dataJson = new Object();
    dataJson.WorkShopID = WorkShopID;
    dataJson.Content = tarea_essay;
    dataJson.CourseId = inCourseId;
    dataJson.LessonId = inLessonId;
    var myWebApiClient = new WebApiClient("../../api/WorkShopEssay");
    myWebApiClient.Post(dataJson, showEssayResult);
  });

  InitPage();
  $("#txtCommant").keyup(function () {
    if ($(this).val().length <= 500) {
      $("#commantnum").html($(this).val().length + "/500");
    }
  });

  $("#btnCommant").click(function () {
    SaveReview(inLessonId);
  });

  $("#allcomment").click(function () {
    $("#allcomment").attr("class", "all-link");
    $("#mycomment").attr("class", "inline-link");
    $("#ulCommant").html("");
    LoadListInfo(inLessonId, 1, 0, 0);
  });

  $("#mycomment").click(function () {
    $("#mycomment").attr("class", "all-link");
    $("#allcomment").attr("class", "inline-link");
    $("#ulCommant").html("");
    LoadListInfo(inLessonId, 1, 0, 1);
  });

  $("#a_publishtime").click(function () {
    $("#ulCommant").html("");
    if ($(this).attr("value") == 1) {
      $(this).html("发表时间⇅");
      $(this).attr("value", "2");
      LoadListInfo(inLessonId, 1, 1, allormy);
    } else {
      $(this).html("发表时间⇵");
      $(this).attr("value", "1");
      LoadListInfo(inLessonId, 1, 2, allormy);
    }
  });

  $("#a_givetime").click(function () {
    $("#ulCommant").html("");
    if ($(this).attr("value") == 3) {
      $(this).html("点赞数⇅");
      $(this).attr("value", "4");
      LoadListInfo(inLessonId, 1, 3, allormy);
    } else {
      $(this).html("点赞数⇵");
      $(this).attr("value", "3");
      LoadListInfo(inLessonId, 1, 4, allormy);
    }
  });

  $("#a_close").click(function () {
    $(".tcq-bjs").hide();
  });

  $(document).tooltip({
    track: true,
  });
});

function InitPage() {
  if (theTopNav_Front.IsLogin()) {
    GetReviewList(inLessonId, 1, 0, 0);
  } else {
    // 未准备好，等待0.1秒
    setTimeout(InitPage, 100); // 0.1秒后重新执行
  }
}

function showEssayResult(iResult) {
  if (iResult) {
    alert(iResult.Message);
  }
}

function getuseressay(WorkShopID, inCourseId, lessonId) {
  var myWebApiClient = new WebApiClient("../../api/WorkShopEssay/getuseressay");
  myWebApiClient.Get(
    {
      workshopId: WorkShopID,
      id: 0,
      courseId: inCourseId,
      lessonId: lessonId,
    },
    function (result) {
      if (result != null) {
        $("#tarea_essay").val(result.Content);
      }
    }
  );
}

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function escape2Html(str) {
  return str.replace(/amp;/g, "");
}

function GetCoursewareDetails(CID) {
  var myWebApiClient = new WebApiClient(
    "../../api/Course/GetCoursewareDetailsByBID"
  );
  myWebApiClient.Get(
    {
      CID: CID,
    },
    function (result) {
      if (result != null) {
        $("#_kjmc").html(result.Courseware.CName);
        $("#_ctime").html(result.Courseware.CTime);
        var Grade = Math.round(result.Courseware.AutoGrade);
        if (result.Courseware.SystemGrade > 0) {
          Grade = result.Courseware.SystemGrade;
        }
        $.fn.raty.defaults.path = "../../raty/lib/img";
        $("#div_grade").raty({
          width: 120,
          score: Grade,
          click: function (scores, evt) {
            var json = Object();
            json.Type = ShareType.COURSE;
            json.TypeID = result.Courseware.CID;
            json.WorkShopID = WorkShopID;
            json.Levels = scores;
            json.Grade = Grade;
            OnGrade(this, json);
          },
        });
        if (result.Courseware.IsType == 1) {
          $("#courseplayer").hide();
          $("#course_video").attr(
            "src",
            escape2Html(result.Courseware.CConTent)
          );
        } else if (result.Courseware.IsType == 2) {
          $("#course_video").hide();
          LoadXMLTree(result);
        } else if (result.Courseware.IsType == 3) {
          $.ajax({
            url: "../../api/Course/GetXMLZ",
            dataType: "xml",
            type: "Post",
            cache: false,
            async: false,
            data: {
              "": result.Courseware.CConTent,
            },
            error: function (textStatus, errorThrown, sadsda) {
              alert("课程文件丢失,请联系课程管理员！"); // + textStatus + "," + errorThrown + "," + sadsda
            },
            success: function (xml) {
              var title = $(xml).find("baseinfo").find("title").text();
              $("#_kjmc").html(title); //设置标题

              var s = "[";
              var o = $(xml).find("organization").children(); //菜单对象
              var s = GetTreeData(o); //生成无限级树的字符串。
              s = s.substring(0, s.length - 2); //截掉末尾2位。
              var t = eval("(" + s + ")");

              //树
              $("#ZyTreeView").tree({
                animate: true,
                data: t,
                formatter: function (node) {
                  return (
                    '<span title="' +
                    node.text +
                    '"  class="trtooltip" >' +
                    node.text.limits(24) +
                    "</span>"
                  );
                },
                onLoadSuccess: function () {
                  $(".trtooltip").tooltip({
                    onShow: function () {
                      $(this).tooltip("tip").css({
                        boxShadow: "1px 1px 2px #292929",
                      });
                    },
                  });
                },
                onClick: function (node) {
                  //-----点击新节点时，停止其他所有递归计时-----------------------
                  isGo = false;
                  LarningGo = false;
                  CloseQusetionGo = false;
                  //--------------------------------------------------------------

                  setTimeout(function () {
                    if (node.id == $("#myNodeId").val()) {
                      return;
                    } else {
                      if (IsStop == false) {
                        LearnningManage.Stop(
                          WorkShopID,
                          inCourseId,
                          inLessonId,
                          0
                        );
                      }

                      $("#myNodeId").val(node.id);
                    }

                    var r = $(xml).find("resources"); //XML中资源对象

                    //以下为XML中此节点中各参数的值。
                    var my_ref = node.id;
                    var type = node.attributes.type;
                    var refqid = node.attributes.refqid; //视频--测试题引用
                    var popchk = "";
                    popchk = node.attributes.popchk; //视频--跳出测试题的时间

                    var myObj = r.find("resource[id='" + my_ref + "']");
                    var xtype = myObj.attr("xtype");

                    var href = "";
                    href = myObj.attr("href");
                    var c_title = myObj.find("title").text();
                    var duration = myObj.find("duration").text(); //表示视频的时间。
                    var learntime = myObj.find("learntime").text(); //表示需要学习的时间
                    var origFile = myObj.find("origFile").text(); //一般不为空，可用于用户下载此文件
                    var isDload = myObj.find("isDload").text(); //0表示不下载，1表示可以下载

                    href = href.replace("\\", "/");
                    if (href.substring(0, 1) != "/") {
                      href = "/" + href;
                    }

                    var fornUrl = result.Courseware.CConTent.substring(
                      0,
                      result.Courseware.CConTent.lastIndexOf("/")
                    );
                    var f_url = fornUrl + href;

                    var c_content = "";

                    //设置标题
                    //if (isDload == "1") {

                    //    origFile = origFile.replace("\\", "/");
                    //    if (origFile.substring(0, 1) != "/") {
                    //        origFile = "/" + origFile;
                    //    }

                    //    var xz_url = fornUrl + origFile;
                    //    $("#_kjmc").html(c_title + "<a href='" + xz_url + "'  style='font-family: Arial;font-size: 14px;'>下载</a>");
                    //} else {
                    //    $("#_kjmc").html(c_title);
                    //}

                    //设置时间
                    //if (learntime != "" && IsLessonTime == true) {
                    //    $("#c_time").html("本节需要学习的时间为  " + learntime + "      您已学习：  <span id='min' class='yellow'>00:00</span>");
                    //}
                    //else//不需要学习则将--时间设置为空。
                    //{
                    //    $("#c_time").html("");
                    //}

                    //-----点击新节点时，停止其他所有递归计时-----------------------
                    isGo = false;
                    LarningGo = false;
                    CloseQusetionGo = false;
                    //--------------------------------------------------------------

                    //设置一个随机数,以便能获取到播放器。
                    var rand = Math.round(Math.random() * 100000000);
                    //console.log(xtype);
                    if (xtype == "doc") {
                      $("#course_video").hide();
                      $("#courseplayer").html("");
                      $("#courseplayer").show();
                      var swf = SetSwf2(f_url);
                      //$("#courseplayer").html("");
                      $("#courseplayer").html(swf);
                      //$("#courseplayer").html('<div id="videoplayer' + rand + '"></div>');
                    } else if (xtype == "vedio") {
                      //视频
                      $("#course_video").hide();
                      $("#courseplayer").show();
                      playervideo(f_url, rand, "", "");
                    } else if (xtype == "html") {
                      $("#course_video").show();
                      $("#courseplayer").hide("");
                      $("#courseplayer").html("");
                      $("#course_video").attr("src", escape2Html(f_url));
                    }
                  }, 1100);
                }, //节点点击---结束括号
              }); //树---结束括号
            }, //success
          }); //读取XML---结束括号
        } else if (result.Courseware.IsType == 5) {
          $("#course_video").hide();
          var rand = Math.round(Math.random() * 100000000);
          playervideo(result.Courseware.CConTent, rand, "", "");
        } else if (result.Courseware.IsType == 6) {
          $("#course_video").hide();
          var rand = Math.round(Math.random() * 100000000);
          readerdoc(result.Courseware.CConTent, rand);
        } else {
          $("#course_video").hide();
          var sdk = baidubce.sdk;
          var VodClient = sdk.VodClient;
          var config = {
            endpoint: "http://vod.bj.baidubce.com",
            credentials: {
              ak: "0b3d1443d19646099b5e74bfa8fc7455",
              sk: "196573a9c6584928804d613761059e1c",
            },
          };
          var client = new VodClient(config);
          client
            .getMediaResource(result.Courseware.CConTent)
            .then(function (response) {
              if (response.body.status == "RUNNING") {
                $("#courseplayer").html("<h2>视频正在转码中。。。</h2>");
              } else if (response.body.status == "FAILED") {
                $("#courseplayer").html("<h2>视频转码失败。。。</h2>");
              } else if (response.body.status == "PROCESSING") {
                $("#courseplayer").html("<h2>视频正在上传中。。。</h2>");
              } else if (response.body.status == "DISABLED") {
                $("#courseplayer").html("<h2>该视频已停用。。。</h2>");
              } else if (response.body.status == "BANNED") {
                $("#courseplayer").html("<h2>该视频已屏蔽。。。</h2>");
              } else {
                // 查询成功
                playervideo(response.body.playableUrlList[0].url, rand, "", "");
              }
            });
        }
        LearnningManage.Open();
        zsj = result.Courseware.CTime * 60;
        var arr = LearnningManage.GetNodeTime(
          WorkShopID,
          inCourseId,
          inLessonId,
          0,
          zsj,
          0
        );
        yxsj = parseInt(arr.split(",")[0], "10");
        //console.log(yxsj);
        var minutes = Math.floor(yxsj / 60);
        var seconds = Math.floor(yxsj % 60);

        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        $("#min").text(minutes + ":" + seconds);
        if (result.Courseware.IsType == 1 || result.Courseware.IsType == 6) {
          IsStop = true;
          LearnningManage.Start(WorkShopID, inCourseId, inLessonId, 0, zsj);
          var rand = Math.round(Math.random() * 100000000);
          LearingOnTime(yxsj + 1, 0, zsj, 0, rand, "", "");
        }
      }
    }
  );
}

//无线级树
function GetTreeData(o) {
  var s = "[";
  o.each(function () {
    var c = $(this).children();
    if (c.length > 0) {
      var mytext = $(this).clone().children().remove().end().text();
      mytext = $.trim(mytext);
      s +=
        '{ "id":"' +
        $(this).attr("ref") +
        '",attributes:{"type":"' +
        $(this).attr("type") +
        '","refqid":"' +
        $(this).attr("refqid") +
        '","popchk":"' +
        $(this).attr("popchk") +
        '"},"text":"' +
        mytext +
        '", "iconCls": "icon-folder","children":';
      s += GetTreeData(c);
    } else {
      if ($(this).attr("type") != "test") {
        s +=
          '{"id":"' +
          $(this).attr("ref") +
          '",attributes:{"type":"' +
          $(this).attr("type") +
          '","refqid":"' +
          $(this).attr("refqid") +
          '","popchk":"' +
          $(this).attr("popchk") +
          '"},"iconCls":"icon-folder","text":"' +
          $(this).text() +
          '"},';
      }
    }
  });

  s = s.substring(0, s.length - 1);

  s += "]},";

  return s;
}

//设置练习题（视频弹出的题目）。
function SetTest_video(f_url, qanswer, itemcount) {
  var c_content =
    '<div style="color:red;padding:5px;">学习计时已暂停，正确完成下面的即时问答题计时方可继续，请谨慎作答，答错或不作答将停止计时，并在' +
    NexShowTime +
    '秒后才能重新作答。剩余答题时间：<span id="q_RemainTime"></span>秒</div>' +
    '<iframe style="width:100%;height:350px;  border:0px solid #ffffff;" src="' +
    f_url +
    '"></iframe>';

  if (qanswer != "" && itemcount != "") {
    c_content += "<div>   请选择正确答案：";
    var q_count = parseInt(itemcount);
    if (q_count >= 1)
      c_content += '   <input type="radio" name="q" qid="A" />A';
    if (q_count >= 2)
      c_content += '   <input type="radio" name="q" qid="B" />B';
    if (q_count >= 3)
      c_content += '   <input type="radio" name="q" qid="C" />C';
    if (q_count >= 4)
      c_content += '   <input type="radio" name="q" qid="D" />D';
    if (q_count >= 5)
      c_content += '   <input type="radio" name="q" qid="E" />E';
    if (q_count >= 6)
      c_content += '   <input type="radio" name="q" qid="F" />F';

    c_content +=
      "   <input type='button' value='确认' id='qanswer' qtype='单选' qanswer='" +
      qanswer +
      "' /></div>";
  }

  return c_content;
}

//设置Swf
function SetSwf2(f_url) {
  return (
    '<object id="exercises" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="510">' +
    ' <param name="movie" value="' +
    f_url +
    '" />' +
    ' <param name="wmode" value="window" />' +
    ' <param name="flashvars" value=""/>' +
    ' <object id="exercisesEx" type="application/x-shockwave-flash"' +
    ' data="' +
    f_url +
    '" width="100%"  height="510" >' +
    ' <param name="flashvars" value=""/>' +
    ' <a href="http://www.adobe.com/go/getflashplayer">' +
    ' <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" />' +
    " </a>" +
    " </object>" +
    " </object>"
  );
}

function LoadXMLTree(result) {
  $("#ZyTreeView").tree({
    valueField: "id",
    textField: "text",
    data: result.ZYFL,
    lines: true,
    multiple: false,
    animate: true,
    dnd: true,
    formatter: function (node) {
      return (
        '<span title="' +
        node.text +
        '"  class="trtooltip" >' +
        node.text.limits(24) +
        "</span>"
      );
    },
    onLoadSuccess: function () {
      $(".trtooltip").tooltip({
        onShow: function () {
          $(this).tooltip("tip").css({
            boxShadow: "1px 1px 2px #292929",
          });
        },
      });
    },
    onBeforeLoad: function (node) {},
    onBeforeSelect: function (node) {},
    onClick: function (node) {
      var tempObj = result.ZYXQ.filter((p) => {
        return p.ZYML == node.id;
      });
      var wtObj = result.WTXQ.filter((p) => {
        return p.WTML == node.id;
      });

      //console.log(result);
      //设置一个随机数,以便能获取到播放器。
      var rand = Math.round(Math.random() * 100000000);
      if (tempObj[0].ZYLX == 1) {
        wtnum = 0;
        playervideo(tempObj[0].PATH, rand, wtObj, result.WTList);
      } else {
        readerdoc(tempObj[0].MEDID, rand);
      }
    },
  });
}
var player;

function playervideo(path, rand, wtobj, WTList) {
  $("#courseplayer").html("");
  $("#courseplayer").html('<div id="videoplayer' + rand + '"></div>');
  player = cyberplayer("videoplayer" + rand)
    .setup({
      stretching: "uniform",
      width: "100%",
      height: 510,
      file: path,
      autostart: false,
      repeat: false,
      volume: 100,
      controls: true,
      ak: "0b3d1443d19646099b5e74bfa8fc7455", // 公有云平台注册即可获得accessKey
    })
    .onPause(function () {
      LearnningManage.Stop(WorkShopID, inCourseId, inLessonId, 0);
      IsStop = false;
    })
    .onPlay(function () {
      IsStop = true;
      LearnningManage.Start(WorkShopID, inCourseId, inLessonId, 0, zsj);
      var rand = Math.round(Math.random() * 100000000);
      LearingOnTime(yxsj + 1, 0, zsj, 0, rand, wtobj, WTList);
    })
    .onComplete(function () {
      LearnningManage.Stop(WorkShopID, inCourseId, inLessonId, 0);
      IsStop = false;
    });
}

function readerdoc(medid, rand) {
  IsStop = false;
  $("#courseplayer").html("");
  $("#courseplayer").html('<div id="readerdoc' + rand + '"></div>');
  var option = {
    docId: medid,
    token: "TOKEN",
    host: "BCEDOC",
    serverHost: "http://doc.bj.baidubce.com",
    width: 896, //文档容器宽度
    zoom: false, //是否显示放大缩小按钮
    zoomStepWidth: 200,
    pn: 1, //定位到第几页，可选
    ready: function (handler) {
      // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
      handler.setFontSize(1);
      handler.setBackgroundColor("#000");
      handler.setFontColor("#fff");
    },
    flip: function (data) {
      // 翻页时回调函数, 可供客户进行统计等
      console.log(data.pn);
    },
    fontSize: "big",
    toolbarConf: {
      page: true, //上下翻页箭头图标
      pagenum: true, //几分之几页
      full: false, //是否显示全屏图标,点击后全屏
      copy: false, //是否可以复制文档内容
      position: "center", // 设置 toolbar中翻页和放大图标的位置(值有left/center)
    }, //文档顶部工具条配置对象,必选
  };
  new Document("readerdoc" + rand, option);
}

var LearnningManage = {
  Open: function () {
    var myWebApiClient = new WebApiClient("../../api/Course/LearnTimeOpen");
    myWebApiClient.Get({}, function (result) {
      if (result.Code < 0) {
        console.log("开始学习失败，错误信息：" + result.Message);
      }
    });
  },

  Start: function (classId, courseId, lessonId, nodeId, maxTime) {
    var myWebApiClient = new WebApiClient("../../api/Course/StartLearning");
    myWebApiClient.Get(
      {
        myClassId: classId,
        myCourseId: courseId,
        myLessonId: lessonId,
        inNodeId: nodeId,
        myMaxTime: maxTime,
      },
      function (result) {
        if (result.Code < 0) {
          alert("网络错误：连接失败，请刷新重试！");
        }
      }
    );
  },

  Stop: function (classId, courseId, lessonId, nodeId) {
    var myWebApiClient = new WebApiClient("../../api/Course/StopLearning");
    myWebApiClient.Get(
      {
        myClassId: classId,
        myCourseId: courseId,
        myLessonId: lessonId,
        inNodeId: nodeId,
      },
      function (data) {
        if (data.Code < 0) {
          // alert("停止学习失败，错误信息：" + data.Message);
        }
      }
    );
  },

  Report: function (classId, courseId, lessonId, nodeId) {
    var myWebApiClient = new WebApiClient("../../api/Course/ReportOfLearning");
    myWebApiClient.Get(
      {
        myClassId: classId,
        myCourseId: courseId,
        myLessonId: lessonId,
        inNodeId: nodeId,
      },
      function (data) {
        if (data.Code < 0) {
          if (data.Code == -1003) {
            alert(
              "检测到您的账号同时在进行学习多个课件，此课件将不不会被记录学习时间！"
            );
          } else {
            alert(data.Message);
          }
        }
      }
    );
  },
  GetNodeTime: function (
    classId,
    courseId,
    lessonId,
    nodeId,
    nodeAllTime,
    type
  ) {
    var returnValue = "-1";
    var myWebApiClient = new WebApiClient("../../api/Course/GetNodeTime");
    myWebApiClient.GetSyn(
      {
        myClassId: classId,
        myCourseId: courseId,
        myLessonId: lessonId,
        myNodeId: nodeId,
        myNodeAllTime: nodeAllTime,
        mytype: type,
      },
      function (data) {
        if (data.Code < 0) {
          alert("获取节点时间失败，错误信息：" + data.Message);
        } else {
          returnValue = data.Message;
        }
      }
    );
    //console.log(returnValue);
    return returnValue;
  },
};

var cfwt = 0;
var wtnum = 0;
var times = null;
//学习计时。yixueTime 单位：秒 ;
function LearingOnTime(
  yixueTime,
  timuTime,
  allTime,
  nodeId,
  rand,
  wtobj,
  WTList
) {
  if (IsStop == false) {
    clearTimeout(times);
    return false;
  }
  if (yixueTime > allTime) {
    yixueTime = allTime;
  }
  minutes = Math.floor(yixueTime / 60);
  seconds = Math.floor(yixueTime % 60);

  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  var temp_yixueTime = yixueTime;
  yxsj = yixueTime;
  cfwt++;
  if (wtobj != "") {
    console.log(cfwt);
    if (cfwt == wtobj[0].CFSC) {
      //wtobj[0].CFSC
      if (wtobj[0].XTFS == "1") {
        if (wtobj[0].WTList.length > 0) {
          var wtlistlen = wtobj[0].WTList.length;
          var radom = Math.floor(Math.random() * wtlistlen);
          //console.log(wtobj[0].WTList[radom]);
          if (wtnum < wtlistlen) {
            ReportingQue(wtobj[0].WTList[radom], wtnum);
            player.pause();
          }
        }
      } else {
        if (WTList.length > 0) {
          var tempObj = WTList.filter((p) => {
            return p.SFQY == 1;
          });
          var wtlistlen = tempObj.length;
          var radom = Math.floor(Math.random() * wtlistlen);
          //console.log(tempObj[radom]);
          if (wtnum < wtlistlen) {
            ReportingQue(tempObj[radom], wtnum);
            player.pause();
          }
        }
      }
      cfwt = 0;
      wtnum++;
    }
  }
  if (temp_yixueTime % 60 == 0) {
    //每分钟报告一次。
    LearnningManage.Report(WorkShopID, inCourseId, inLessonId, 0);
  }

  $("#min").text(minutes + ":" + seconds);
  var temp = yixueTime + 1;

  //console.log("yixueTime:" + yixueTime);
  //console.log("allTime:" + allTime);

  if (yixueTime >= allTime) {
    LearnningManage.Stop(WorkShopID, inCourseId, inLessonId, 0);
    clearTimeout(times);
    return; //结束计时。
  } else {
    clearTimeout(times);
    times = setTimeout(function () {
      LearingOnTime(temp, timuTime, allTime, nodeId, rand, wtobj, WTList);
    }, 1020);
  }
}

function ReportingClose() {
  $(".tcq-bj").remove();
}

function ReportingQue(wtobj, j) {
  var htmlstr = '<div class="tcq-bj">';
  htmlstr += '<div class="one" style="background:white;">';
  htmlstr +=
    '<div style="height:40px;line-height: 49px;padding-left:20px;font-size:14px;color:black;font-weight:bold;">';
  htmlstr += " <dl>";
  htmlstr +=
    "<dt style='width:98%;'>视频答题<span onclick='ReportingClose()' style='float:right;cursor:pointer;display:none'>X</span></dt>";
  htmlstr += "</dl>";
  htmlstr += "</div>";
  htmlstr += '<div class="one-nr">';
  htmlstr += "<dt>";
  htmlstr += "<p>";
  //var isshow = "";
  //if (j == 0){
  //    var isshow = "display:block";
  //} else {
  //    var isshow = "display:none";
  //}
  //htmlstr += "<div id=\"dt" + j + "\" style=" + isshow+">";

  if (wtobj.WTLX == 1) {
    htmlstr +=
      '<div><p style="float:left;margin-right:7px;color:red;font-weight:blod">（单选题）' +
      (j + 1) +
      ".</p>" +
      wtobj.WTTG +
      "</div>";
    htmlstr +=
      '<div><input type="radio" id="sxwf' +
      j +
      '" name="DXType' +
      j +
      '"  value="A" /><label for="sxwf' +
      j +
      '" style="margin-left:7px;">A</lable></div>';
    htmlstr +=
      '<div><input type="radio" id="sxwf1' +
      j +
      '" name="DXType' +
      j +
      '"  value="B" /><label for="sxwf1' +
      j +
      '" style="margin-left:7px;">B</lable></div>';
    htmlstr +=
      '<div><input type="radio" id="sxwf2' +
      j +
      '" name="DXType' +
      j +
      '"  value="C" /><label for="sxwf2' +
      j +
      '" style="margin-left:7px;">C</lable></div>';
    htmlstr +=
      '<div><input type="radio" id="sxwf3' +
      j +
      '" name="DXType' +
      j +
      '"  value="D" /><label for="sxwf3' +
      j +
      '" style="margin-left:7px;">D</lable></div>';
    htmlstr +=
      '<div style="text-align:center;margin:15px;"><input type="button" class=\'btn_ok\' style="background:#169bd5;border-radius:6px;border:none;color:#fff;padding:5px 20px;margin-left:20px" onclick="AnswerSub(1,' +
      j +
      ",'DXType','" +
      wtobj.ZQDA +
      '\');" value="提交" /></div>';
  } else if (wtobj.WTLX == 3) {
    htmlstr +=
      '<div><p style="float:left;margin-right:7px;color:red;font-weight:blod">（判断题）' +
      (j + 1) +
      ".</p>" +
      wtobj.WTTG +
      "</div>";
    htmlstr +=
      '<div><input type="radio" id="sxwf' +
      j +
      '" name="PDType' +
      j +
      '"  value="0" /><label for="sxwf' +
      j +
      '" style="margin-left:7px;">错</lable></div>';
    htmlstr +=
      '<div><input type="radio" id="sxwf1' +
      j +
      '" name="PDType' +
      j +
      '"  value="1" /><label for="sxwf1' +
      j +
      '" style="margin-left:7px;">对</lable></div>';
    htmlstr +=
      '<div style="text-align:center;margin:15px;"><input type="button" class=\'btn_ok\'  style="background:#169bd5;border-radius:6px;border:none;color:#fff;padding:5px 20px;margin-left:20px" onclick="AnswerSub(3,' +
      j +
      ",'PDType','" +
      wtobj.ZQDA +
      '\');" value="提交" /></div>';
  } else {
    htmlstr +=
      '<div><p style="float:left;margin-right:7px;color:red;font-weight:blod">（多选题）' +
      (j + 1) +
      ".</p>" +
      wtobj.WTTG +
      "</div>";
    htmlstr +=
      '<div><input type="checkbox" id="sxwf' +
      j +
      '" name="DDXType' +
      j +
      '"  value="A" /><label for="sxwf' +
      j +
      '" style="margin-left:7px;">A</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf1' +
      j +
      '" name="DDXType' +
      j +
      '"  value="B" /><label for="sxwf1' +
      j +
      '" style="margin-left:7px;">B</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf2' +
      j +
      '" name="DDXType' +
      j +
      '"  value="C" /><label for="sxwf2' +
      j +
      '" style="margin-left:7px;">C</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf3' +
      j +
      '" name="DDXType' +
      j +
      '"  value="D" /><label for="sxwf3' +
      j +
      '" style="margin-left:7px;">D</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf4' +
      j +
      '" name="DDXType' +
      j +
      '"  value="E" /><label for="sxwf4' +
      j +
      '" style="margin-left:7px;">E</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf5' +
      j +
      '" name="DDXType' +
      j +
      '"  value="F" /><label for="sxwf5' +
      j +
      '" style="margin-left:7px;">F</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf6' +
      j +
      '" name="DDXType' +
      j +
      '"  value="G" /><label for="sxwf6' +
      j +
      '" style="margin-left:7px;">G</lable></div>';
    htmlstr +=
      '<div><input type="checkbox" id="sxwf7' +
      j +
      '" name="DDXType' +
      j +
      '"  value="H" /><label for="sxwf7' +
      j +
      '" style="margin-left:7px;">H</lable></div>';
    htmlstr +=
      '<div style="text-align:center;margin:15px;"><input type="button"  class=\'btn_ok\' style="background:#169bd5;border-radius:6px;border:none;color:#fff;padding:5px 20px;margin-left:20px" onclick="AnswerSub(2,' +
      j +
      ",'DDXType','" +
      wtobj.ZQDA +
      '\');" value="提交" /></div>';
  }
  //htmlstr += "</div>";

  htmlstr += "</p>";
  htmlstr += "</dt>";
  htmlstr += "</div>";
  htmlstr += "</div>";
  htmlstr += "</div>";
  $("body").append(htmlstr);
}

function AnswerSub(type, obj, name, zqda) {
  var id = parseInt(obj);
  var name = name + obj;
  var val = "";
  if (type == 2) {
    $("input[name=" + name + "]:checked").each(function () {
      val += $(this).val() + ",";
    });
    val = val.substring(0, val.length - 1);
  } else {
    val = $("input:radio[name=" + name + "]:checked").val();
  }
  if (val == zqda) {
    $(".tcq-bj").remove();
    //$("#dt" + obj).hide();
    //$("#dt" + (id + 1)).show();
    player.play();
  } else {
    alert("回答错误,请10秒后作答!");
    var count = 10;
    var countdown = setInterval(CountDown, 1000);

    function CountDown() {
      $(".btn_ok").attr("disabled", true).css("background-color", "#cccccc");
      $(".btn_ok").val("提交(" + count + ")");
      if (count == 0) {
        $(".btn_ok")
          .val("提交")
          .removeAttr("disabled")
          .css("background-color", "#169bd5");
        clearInterval(countdown);
      }
      count--;
    }
    return;
  }
}

function VerifyData() {
  var txtContent = $("#txtCommant").val().replace(/ /gi, "");

  if (txtContent == "") {
    alert("评论内容不能为空！");
    return false;
  }
  if (txtContent.length <= 7) {
    alert("评论内容不能少于10个字符！");
    return false;
  }
  return true;
}

function SaveReview(Id) {
  if (!VerifyData()) return;
  newFunction(1, Id, "");
}

function sub_Reply(TypeId, ParentID) {
  var Reply_Context = $("#Reply_" + ParentID)
    .val()
    .replace(/(^\s+)|(\s+$)/g, "");
  if (Reply_Context != "") {
    if (Reply_Context.length > 10) {
      newFunction(2, TypeId, ParentID);
    } else {
      alert("点评、回复字数必须达到10个字以上才能发布哦！");
    }
  } else {
    alert("请填写评论信息！");
  }
}

function reviewShow(Ids) {
  $("#Reply_Show" + Ids).toggle();
}

function Reply_Commont(ReplyName, replyIds, ParentID) {
  $("#Reply_Show" + ParentID).show();
  ReplyID = replyIds;
  $("#Reply_" + ParentID).val("回复 " + ReplyName + "：");
}

// 获取观课随笔评论列表
function GetReviewList(Id, pg, sort, allormytype) {
  $("#hdPage").val(pg);
  var isDelete = false;
  var UserID = "";
  if (theTopNav_Front != null) {
    if (theTopNav_Front.GetRoleID > 0 && theTopNav_Front.GetRoleID < 19) {
      //=========具有评论权限,登录用户拥有
      isDelete = true;
    } else {
      UserID = theTopNav_Front.GetUserID;
    }
  }
  var myWebApiClient = new WebApiClient("../../api/WorkShopReview");
  myWebApiClient.GetLoad(
    {
      TypeId: Id,
      page: pg,
      rows: 10,
      Type: ShareType.COURSECOMMENT,
      sort: sort,
      allormytype: allormytype,
    },
    function (result) {
      $("#ulCommant").empty();
      if (result.rows != null && result.rows.length > 0) {
        var sbhtml = "";
        $.each(result.rows, function (i, item) {
          var delhtml = "";
          var WorkShopName = "";
          if (isDelete == true) {
            delhtml =
              "<b><a class='a_commant' href='javascript:void(0)' onclick=\"DeleteReview('" +
              Id +
              "'," +
              item.Id +
              ')">' +
              "删 除" +
              "</a></b>";
          } else if (UserID == item.UserId) {
            delhtml =
              "<b><a class='a_commant' href='javascript:void(0)' onclick=\"DeleteReview('" +
              Id +
              "'," +
              item.Id +
              ')">' +
              "删 除" +
              "</a></b>";
          }
          sbhtml +=
            '<dl><img onerror="nofindimg(this);" height="60" width="60" src="' +
            item.Logo +
            '">';
          if (
            item.WorkShopName != "" &&
            item.WorkShopName != null &&
            item.WorkShopID != WorkShopID
          )
            WorkShopName = "评论来自: " + item.WorkShopName;

          sbhtml +=
            "<dd><b><a class='a_commant' onclick=\"Reporting(" +
            ShareType.COURSECOMMENT +
            ",'" +
            item.Context.delHtml() +
            "','" +
            item.UserName +
            "'," +
            item.Id +
            "," +
            item.UserId +
            ')">举报</a></b>' +
            delhtml +
            "<b><a class='a_commant'  href='javascript:void(0)' onclick='reviewShow(" +
            item.Id +
            ')\'>回复</a></b><b class="ico-zan" id="Commant_' +
            item.Id +
            '"><a href="javascript:ClickPraise(' +
            ShareType.COURSECOMMENT +
            "," +
            item.Id +
            ')"> </a>赞(<b id="' +
            ShareType.COURSECOMMENT +
            "praise" +
            item.Id +
            '" >' +
            item.PraiseCount +
            "</b>)</b><b>" +
            item.UserName +
            "</b>  <span>" +
            item.CreateTime +
            "</span>  <span style='color:#ccc'>" +
            WorkShopName +
            "</span><p style='word-break:break-all'>" +
            HtmlUtil.escape2Html(item.Context) +
            '</p></dd><p class="btn-comment-answer"></p>';
          sbhtml += '<div class="hf-ys">';
          for (var j = 0; j < item.ReviewList.length; j++) {
            var WorkShopNames = "";
            sbhtml +=
              '<dl><img height="60" width="60"  onerror="nofindimg(this);" src="' +
              item.ReviewList[j].Logo +
              '" >';
            if (
              item.ReviewList[j].WorkShopName != "" &&
              item.ReviewList[j].WorkShopName != null &&
              item.ReviewList[j].WorkShopID != WorkShopID
            )
              WorkShopNames = "评论来自: " + item.ReviewList[j].WorkShopName;
            sbhtml +=
              "<dd><b><a class='a_commant'  onclick=\"Reporting(" +
              ShareType.COURSECOMMENT +
              ",'" +
              item.ReviewList[j].Context.delHtml() +
              "','" +
              item.ReviewList[j].UserName +
              "'," +
              item.ReviewList[j].Id +
              "," +
              item.UserId +
              ')">举报</a></b><b class="ico-zan"><a href="javascript:void(0)" onclick="Reply_Commont(\'' +
              item.ReviewList[j].UserName +
              "','" +
              item.ReviewList[j].Id +
              "','" +
              item.Id +
              '\')" style="float:right;  background:none; width:50px; font-weight:bold; text-align:right">回复</a><b><a href="javascript:void(0)"  onclick="DeleteReview(\'' +
              Id +
              "'," +
              item.ReviewList[j].Id.toString() +
              ')" style="float:right; padding-left:20px; background:none; width:50px; text-align:right">删除</a></b></b><b>' +
              item.ReviewList[j].UserName +
              "</b>  <span>" +
              item.ReviewList[j].CreateTime +
              "</span>  <span style='color:#ccc'>" +
              WorkShopNames +
              '</span><p><span style="color:rgb(51, 51, 51); font-family:微软雅黑;font-size:13px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;orphans:2; text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);display:inline !important;float:none;word-break:break-all">' +
              HtmlUtil.escape2Html(item.ReviewList[j].Context) +
              "</span><br>";
            sbhtml += "</p></dd></dl>";
          }
          sbhtml +=
            '<div class="hf-ys2" style=\'display:none;\' id="Reply_Show' +
            item.Id +
            '"><label><input type="text" name="textfield" id="Reply_' +
            item.Id +
            '"></label>';
          sbhtml +=
            '<span><input type="button" name="button" id="sub_Reply" onclick="sub_Reply(\'' +
            Id +
            "','" +
            item.Id +
            '\')" value="提交"></span></div></div></dl>';
        });
        $("#ulCommant").html(sbhtml);
      }

      //===============加载翻页
      PageComment(
        result.total,
        10,
        $("#hdPage").val(),
        "pageFanye",
        Id,
        "GetReviewList",
        sort,
        allormytype
      );
    },
    "",
    "ulCommant"
  );
}

function nofindimg(obj) {
  obj.src = "image/work-pl-ico.png";
  obj.onerror = null;
}

function DeleteReview(Id, ReviewId) {
  if (confirm("评论删除之后将无法恢复，是否确认删除？")) {
    var headJson = {
      ID: ReviewId,
    };
    var myWebApiClient = new WebApiClient("../../api/WorkShopReview");
    myWebApiClient.Delete(headJson, function (data) {
      if (data != null && data.Code > 0) {
        alert("成功删除一条评论！");
        GetReviewList(Id, 1, 0, 0);
      } else {
        alert("删除评论失败！");
      }
    });
  }
}

function LoadListInfo(id, pg, sort, allormytype) {
  allormy = allormytype;
  $("#hdPage").val(pg);
  GetReviewList(id, pg, sort, allormytype);
}

//type=1评论type=2回复评论
function newFunction(type, Id, ParentID) {
  var sl_str = "";
  var iswork = -1;
  //console.log(theTopNav_Front.myUserInfo);
  if (theTopNav_Front.myUserInfo.UserRoles.length > 1) {
    for (var i = 0; i < theTopNav_Front.myUserInfo.UserRoles.length; i++) {
      var roleid = theTopNav_Front.myUserInfo.UserRoles[i].RoleID;
      if (
        theTopNav_Front.myUserInfo.UserRoles[i].WorkShopID.toUpperCase() ==
        WorkShopID.toUpperCase()
      ) {
        iswork = i;
        break;
      }
      if (roleid >= 11 && roleid <= 20) {
        sl_str +=
          "<option value=" +
          theTopNav_Front.myUserInfo.UserRoles[i].WorkShopID +
          ">" +
          theTopNav_Front.myUserInfo.UserRoles[i].WorkShopName +
          "</option>";
      }
    }
    if (iswork < 0) {
      var htmlstr = '<div class="tcq-bj">';
      htmlstr +=
        '<div class="one" style="background:white;border-radius:5px;color:#333">';
      htmlstr +=
        '<div style="height:40px;line-height: 49px;padding-left:20px;font-size:14px;color:#333;font-weight:bold;">';
      htmlstr += " <dl>";
      htmlstr +=
        "<dt style='width:98%;'>请选择所属工作坊<span onclick='ReportingClose()' style='float:right;cursor:pointer'>X</span></dt>";
      htmlstr += "</dl>";
      htmlstr += "</div>";
      htmlstr += '<div class="one-nr">';
      htmlstr += "<dt>";
      htmlstr += "<p>";
      htmlstr += "<select id='sl_workshop' style=\"height:25px;width:500px;\">";
      htmlstr += sl_str;
      htmlstr += "</select>";
      htmlstr += "</p>";
      htmlstr += "</dt>";
      htmlstr +=
        " <dd><input type=\"button\" onclick=\"ShowSaveCommant('',''," +
        type +
        ",'" +
        ParentID +
        "','" +
        Id +
        '\')" value="提交" /></dd>';
      htmlstr += "</div>";
      htmlstr += "</div>";
      htmlstr += "</div>";
      $("body").append(htmlstr);
    } else {
      var workshopid = theTopNav_Front.myUserInfo.UserRoles[iswork].WorkShopID;
      var workshopname =
        theTopNav_Front.myUserInfo.UserRoles[iswork].WorkShopName;
      ShowSaveCommant(workshopid, workshopname, type, ParentID, Id);
    }
  } else {
    var workshopid = theTopNav_Front.myUserInfo.UserRoles[0].WorkShopID;
    var workshopname = theTopNav_Front.myUserInfo.UserRoles[0].WorkShopName;
    ShowSaveCommant(workshopid, workshopname, type, ParentID, Id);
  }
}

function ShowSaveCommant(workshopid, workshopname, type, ParentID, Id) {
  if (workshopid == "") {
    workshopid = $("#sl_workshop").val();
  }
  if (workshopname == "") {
    workshopname = $("#sl_workshop").find("option:selected").text();
  }

  ReportingClose();
  if (type == 1) {
    var json = Object();
    json.WorkShopId = workshopid;
    json.WorkShopName = workshopname;
    json.Context = $("#txtCommant").val();
    json.TypeId = Id;
    json.Type = ShareType.COURSECOMMENT;
    json.Grade = 0;
    var myWebApiClient = new WebApiClient("../../api/WorkShopReview");
    myWebApiClient.Post(json, function (data) {
      if (data.Code > 0) {
        alert("发表评论成功！");
        $("#txtCommant").val("");
        GetReviewList(Id, 1, 0, 0);
      } else {
        alert(data.Message);
      }
    });
  } else {
    var Reply_Context = $("#Reply_" + ParentID)
      .val()
      .replace(/(^\s+)|(\s+$)/g, "");
    var headJson = {
      WorkShopId: workshopid,
      Context: Reply_Context,
      ParentID: ParentID,
      ReplyID: ReplyID,
      TypeId: Id,
      Type: ShareType.COURSECOMMENT,
      WorkShopName: workshopname,
      Grade: 0,
    };
    var myWebApiClient = new WebApiClient("../../api/WorkShopReview/Reply");
    myWebApiClient.Post(headJson, function (data) {
      if (data.Code > 0) {
        alert("回复成功！");
        GetReviewList(Id, 1, 0, 0);
        $("#Reply_" + ParentID).val("");
      } else {
        alert(data.Message);
      }
    });
  }
}

function Reporting(Type, Title, Publisher, ResourceId, Uid) {
  var htmlstr = '<div class="tcq-bj">';
  htmlstr +=
    '<div class="one" style="background:white;border-radius:5px;color:#333">';
  htmlstr +=
    '<div style="height:40px;line-height: 49px;padding-left:20px;font-size:14px;color:#333;font-weight:bold;">';
  htmlstr += " <dl>";
  htmlstr +=
    "<dt style='width:98%;'>请选择投诉举报类型<span onclick='ReportingClose()' style='float:right;cursor:pointer'>X</span></dt>";
  htmlstr += "</dl>";
  htmlstr += "</div>";
  htmlstr += '<div class="one-nr">';
  htmlstr += "<dt>";
  htmlstr += "<p>";
  htmlstr +=
    '<input type="radio" id="sxwf" name="RPType" checked="checked" value="1" /><label for="sxwf" style="margin-left:7px;">涉嫌违法</lable>';
  htmlstr +=
    '<input type="radio" id="ljgg" name="RPType" value="2" style="margin-left:40px" /><label for="ljgg" style="margin-left:7px;">垃圾广告</lable>';
  htmlstr +=
    '<input type="radio" id="mgxx" name="RPType" value="3" style="margin-left:40px"/><label for="mgxx" style="margin-left:7px;">敏感信息</lable>';
  htmlstr +=
    '<input type="radio" id="wfnr" name="RPType" value="4" style="margin-left:40px"/><label for="wfnr" style="margin-left:7px;">违法内容</lable>';
  htmlstr +=
    '<input type="radio" id="qt"  name="RPType" value="5" style="margin-left:40px"/><label for="qt" style="margin-left:7px;">其它</lable>';
  htmlstr +=
    '<div style="font-size:14px;color:#333;font-weight: bold;">请填写举报理由</div>';
  htmlstr +=
    '<textarea id=\'tea_ReasonsReporting\' maxlength="450" style="margin:0px;height:180px;width:501px;border:1px solid #e7e5de;"></textarea>';
  htmlstr +=
    '<div style="font-size:14px;color:#333;font-weight: bold;">上传图片</div>';
  htmlstr +=
    '<div  onclick="F_Open_dialog()"  style="position:absolute;margin-left:60px;margin-top:35px;font-size:13px;width:200px">点击上传图像</div><input type="file" name="_fFiles_jb" style="display:none;" id="_fFiles_jb" /><img id="ReportingImg" style="width:200px;height:100px;border:none" onclick="F_Open_dialog()" /><input type="hidden" id="files" name="Logo" />';
  htmlstr += "</p>";
  htmlstr += "</dt>";
  htmlstr +=
    ' <dd><input type="button" onclick="ReportingSub(' +
    Type +
    ",'" +
    Title +
    "','" +
    Publisher +
    "'," +
    ResourceId +
    "," +
    Uid +
    ')" value="提交" /></dd>';
  htmlstr += "</div>";
  htmlstr += "</div>";
  htmlstr += "</div>";
  $("body").append(htmlstr);
  UploadReportingImg(
    "_fFiles_jb",
    function (result, state) {
      if (state == "success") {
        if (result.Key) {
          //添加附件列表
          $("#files").val(result.Value);
          $("#ReportingImg").attr("src", result.Value);
          $("#ReportingImg").show();
        }
      }
      $("#_fFiles_jb").hide();
    },
    function (err) {}
  );
}

function F_Open_dialog() {
  document.getElementById("_fFiles_jb").click();
}

function ReportingClose() {
  //$(".tcq-bj").hide();
  $(".tcq-bj").remove();
}

function UploadReportingImg(cid, resultFun, ErrFun) {
  $("#" + cid).change(function () {
    var files = $("#" + cid).get(0).files;
    if (files.length > 0) {
      $("#" + cid).hide();
      var data = new FormData();
      data.append("UploadedData", files[0]);

      $.ajax({
        type: "POST",
        url: "/api/fileupload/uploadImg",
        contentType: false,
        processData: false,
        data: data,
        success: function (result, state) {
          if (resultFun != null && resultFun != undefined) {
            $("#" + cid).show();
            resultFun(result, state);
            $("#" + cid).val("");
            if (result.Key == false) {
              alert(result.Value);
            }
          }
        },
        error: function (err) {
          if (ErrFun != null && ErrFun != undefined) {
            $("#" + cid).show();
            divobj.hide();
            ErrFun(err);
            $("#" + cid).val("");
          }
        },
      });
    }
  });
}

function ReportingSub(Type, Title, Publisher, ResourceId, Uid) {
  var url = window.location.href;
  var ReasonsReportings = $("#tea_ReasonsReporting").val().replace(/ /gi, "");
  if (ReasonsReportings == "") {
    alert("举报理由不能为空！");
    return false;
  }
  var ObjProjectId = theTopNav_Front.myProjectID;
  var json = Object();
  json.RPType = $("input[name='RPType']:checked").val();
  json.RPTitle = Title;
  json.ReasonsReporting = $("#tea_ReasonsReporting").val();
  json.ResourceTypes = Type;
  json.WorkShopID = WorkShopID;
  json.ProjectID = ObjProjectId;
  json.State = 0;
  json.ReportingImg = $("#files").val();
  json.Address = url;
  json.Publisher = Publisher;
  json.ResourceId = ResourceId;
  json.PublisId = Uid;
  var myWebApiClient = new WebApiClient(
    "../../api/WorkShopReview/ReportingSub"
  );
  myWebApiClient.Post(json, function (data) {
    if (data.Code > 0) {
      alert(data.Message);
      $("#tea_ReasonsReporting").val("");
      $("input:radio[name='RPType']").attr("checked", false);
      ReportingClose();
    } else {
      alert(data.Message);
    }
  });
}
