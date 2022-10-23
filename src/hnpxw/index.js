var videoObject;
clearInterval(autoPlayTask);
clearInterval(playStateTask);
var autoPlayTask;
var nextPage = false;
//开启任务
function startTask() {
  videoObject = $(".mejs__mediaelement video")[0];
  videoObject.muted = true;
  nextPage = false;
  autoPlayTask = setInterval(function () {
    if (videoObject) {
      if (videoObject.currentTime / videoObject.duration >= 0.995) {
        console.error(
          "下一集" + videoObject.currentTime + "-" + videoObject.duration
        );
        videoObject.pause();
        videoObject.currentTime = 0;
        clearInterval(autoPlayTask);
        if (!nextPage) {
          pageToNextPage();
          setTimeout(function () {
            videoObject = $(".mejs__mediaelement video")[0];
            if (videoObject) {
              videoObject.play();
              startTask();
              nextPage = false;
            }

            if (getAnswer().length > 0) {
              pageToNextPage();
              setTimeout(function () {
                $(".btn-hollow").click();
                setTimeout(function () {
                  startTask();
                }, 5000);
              }, 2000);
            }
          }, 5000);
        }
      }
      console.error(
        Math.round((videoObject.currentTime / videoObject.duration) * 100) + "%"
      );
    } else {
      clearInterval(autoPlayTask);
      pageToNextPage();
      setTimeout(function () {
        $(".btn-hollow").click();
        setTimeout(function () {
          startTask();
          nextPage = false;
        }, 5000);
      }, 2000);
    }
  }, 1000);
}

//  跳转到下一课
function pageToNextPage() {
  nextPage = true;
  if (videoObject || getAnswer().length > 0) {
    $(".next-page-btn").click();
  } else {
    $(".mobile-next-page-btn").click();
  }
}
startTask();
clearInterval(playStateTask);
var playStateTask = setInterval(function () {
  videoObject = $(".mejs__mediaelement video")[0];
  if (videoObject) {
    console.log("播放状态:" + videoObject.paused);
    if (videoObject.paused && videoObject.currentTime < videoObject.duration) {
      videoObject.play();
    }
    $(".btn-submit").click();
  }
}, 1000);

// 获取答案
function getAnswer() {
  var answerList = [];
  $(".correct-answer-area").each((i, element) => {
    $(element)
      .find("span")
      .each(function (index, el) {
        if (index == 1) {
          // console.log($(el).html())
          answerList.push($(el).html());
        }
      });
  });

  answerList.forEach(function (value, index) {
    console.error("第:" + (index + 1) + "题:" + value);
  });
  return answerList;
}
getAnswer().length;

$(".question-element-node").each((index, element) => {
  // 0 单选,1:多选,2:判断
  var answerType = 0;
  var textTitle = "";
  $(element)
    .find("div.question-title-text")
    .each((index1, element1) => {
      $(element1)
        .find("span")
        .each((index2, element2) => {
          var str = $(element2).html();
          if (index2 != 2) {
            textTitle = textTitle + str;
          }
          if (str == "单选题") {
            answerType = 0;
          } else if (str == "多选题") {
            answerType = 1;
          } else {
            answerType = 2;
          }
        });
    });

  var answerList = "";
  $(element)
    .find("a.choice-item")
    .each((index1, element1) => {
      var option = $(element1).find("div.option").html();
      if (option) {
        answerList = answerList + option;
      }
      var text = $(element1).find("div.text").html();
      if (text) {
        answerList = answerList + text + "\n";
      }
    });
  var answerResult = "";
  $(element)
    .find("div.correct-answer-area")
    .find("span")
    .each((index, element) => {
      $(element).html();
      answerResult = answerResult + $(element).html();
    });
  console.log(textTitle);
  console.log(answerList);
  console.log(answerResult);
});
