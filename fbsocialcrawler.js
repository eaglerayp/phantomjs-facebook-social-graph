var page = require('webpage').create();
var fs   = require('fs');
var friendcount=0;
var t;
var userid="joe.wang.585112"; //朱學恆
var taskqueue= new Array();
var alllinks=0;
var bfscount=0;
var bfsdepth=0;
var bfsdeplimit=0;
var bfslimit=3;
var peoplecount=0;
taskqueue.push(userid);

//initialization
var start = Date.now();
page.settings.loadImages=false;
page.viewportSize = { width: 1014, height: 800 };

page.open("http://www.facebook.com/login.php", function(status) {
  if (status === "success") {
    page.evaluate(function() {
        document.getElementById('email').value = 'eagle_rayp@hotmail.com';
        document.getElementById('pass').value   = '0953505318we';   
        document.querySelector('form').submit();
    });
    window.setTimeout(function() {
        //page.render("page.png");
        console.log("login success");
        crawlfriendlist();
            
    }, 3000);
  }//success open facebook
});//open

function crawlfriendlist(){
    if(taskqueue.length>0 &&bfsdepth<bfslimit){
        userid=taskqueue.shift();
        console.log("now target user:"+userid);
        var str=page.evaluate
        (
            function(userid)
            {
                var targeturl = "https://www.facebook.com/"+userid;
                location.href=targeturl;
                return targeturl;
            },userid
        );
        console.log("target"+str);

        window.setTimeout(function(){
            console.log("---> Profile");
            console.log(page.url);
            //sk=friends\">(\\d+)
            page.render("2_Profile.png");
            var count = page.content.match(/friends">([\d,]+)/); 
            if (count===null){
                friendcount=20;
            }else{  
                var friendstring=count[1].replace(',','');
                friendcount=parseInt(friendstring);
            }
            console.log("---> friendcounts:"+friendcount);
            page.evaluate(function()
                {
                    var div = document.querySelector("#fbTimelineHeadline");
                    var as = div.querySelector("a[data-medley-id=pagelet_timeline_medley_friends]");
                    location.href=as.href;
                }
            );

            var height=1000+friendcount/2*130;
            var time =height;
            console.log("HEIGHT"+height);
            page.viewportSize = { width: 1014, height: height };

            window.setTimeout(function(){
                console.log('---> MyFriend');
                console.log(page.url);
               // page.render("3_noimagefriend.png");
                var count = page.content.match(/eng_tid[^\d]+(\d+)/g);
                if(count===null){
                    console.log("this user no open friends");
                } else{
                    var outputstream=fs.open("relation.txt","a");
                    console.log("resultcount:"+count.length);
                    bfscount+=count.length;
                    alllinks+=count.length;
                    for(i=0;i<count.length;i++){
                        var res=count[i].split(";");
                        outputstream.writeLine(userid+";"+res[2]);
                        taskqueue.push(res[2]);
                    }
                    outputstream.flush();
                    outputstream.close();
                }
                t = Date.now() - start;
                console.log('process time' + t/1000 + ' sec');
                peoplecount++;
                console.log('---> END 1 user , now total seen user:'+peoplecount+'now crawl links:'+alllinks
                    +'now in depth:'+bfsdepth);
                if(peoplecount>bfsdeplimit){  //process bfs depth limit
                    bfsdepth++;
                    bfsdeplimit=bfsdeplimit+bfscount;
                    bfscount=0;
                }
                
                crawlfriendlist();
            } ,time);
        }, 4500);
    }else{
        outputstream.close();
        phantom.exit();
    }
}