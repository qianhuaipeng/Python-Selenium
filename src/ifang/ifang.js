// 本课件需要学习的时间
let totalTime = $("#_ctime").html();

let startLearningTimer;
function startLearning() {
  // 媒体对象
  let videoObject = $.find("video")[0];
  startLearningTimer = setTimeout(function () {
    // 已学习时间
    let times = $("#min").html();
    console.log("学习总时间:" + totalTime, "----已学习时间", times);
    // 学习完成
    if (parseInt(times) >= totalTime) {
      clearTimeout(startLearningTimer);
      pageTo();
    } else {
      if (videoObject && videoObject.paused) {
        videoObject.play();
      }
      startLearning();
    }
    Promise.resolve().then(function () {
      new Promise((resolve, reject) => {});
    });
  }, 1000);
}
clearTimeout(startLearningTimer);
startLearning();

/**
 * 跳转连接
 * @param {第几个目录} pageNum
 * @param {目录名称} pageName
 */
function pageTo(pageNum = 1, pageName = "讲座文稿") {
  let pageList = $("#ZyTreeView").children();
  $($("#ZyTreeView").children()[0])
    .find("ul > li")
    .each(function (index, element) {
      pageName = "讲座文稿";
      console.log($(element).find("span.trtooltip").html());
      let liName = $(element).find("span.trtooltip").html();
      if (liName == pageName) {
        console.log($(element), "click");
        $(element).find("div.tree-node").click();
        return;
      }
    });
}

// http://120.46.197.240/wechat/pushMessage?openId=obLTptx0TemXWRqRNM-QKOZx1RKo&message=asdasd
