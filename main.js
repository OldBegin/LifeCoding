const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');


/////////////// templeteHTML ///////////////
function templeteHTML(title, list, body, control){
  return  `<!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
            `;
}
/////////////// templeteLIST ////////////////
function templeteLIST(fileList){
  var list = '<ul>';
  var i=0;
  while(i<fileList.length){
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
    i = i + 1;
  }
  list = list + '</ul>';

  return list;
}
////////////// Create Server ////////////////////////////
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    //console.log(pathname);

    if(pathname === '/'){
    ///////// Routing localhost:3000 /////////////////////
      if(queryData.id === undefined){
        fs.readdir('./data',function(err,fileList){
          var title = 'Welcome';
          var description = 'Hello, Node js';
          var list = templeteLIST(fileList);
          var templete = templeteHTML(
              title,
              list,
              `<h2>${title}</h2><p>${description}</p>`,
              `<p><a href="/create">Create</a></p>`
            );

          response.writeHead(200);
          response.end(templete);
        });
    ///////// Routing localhost:3000/?id='any string' /////////////////////
    }else{
        fs.readdir('./data',function(err,fileList){
          fs.readFile(`data/${queryData.id}`,'utf8',function(error,description){
            var title = queryData.id;
            var list = templeteLIST(fileList);
            var templete = templeteHTML(
                  title,
                  list,
                  `<h2>${title}</h2><p>${description}</p>`,
                  `<p><a href="/create">Create</a> <a href="/update?id=${title}">Update</a> </p>`
                );
            response.writeHead(200);
            response.end(templete);
          });//end readFile
        });//end readDir
      }//end else
    ///////// Routing localhost:3000/create /////////////////////
    }else if(pathname === '/create'){
      fs.readdir('./data',function(err,fileList){
        var title = "Web Create";
        var list = templeteLIST(fileList);
        var templete = templeteHTML(title,list,`<form class="" action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="Title" value=""></p>
          <p><textarea name="description" rows="8" cols="80" placeholder="description"></textarea></p>
          <p><input type="submit" name="" value=""></p>
        </form>`,'');
        response.writeHead(200);
        response.end(templete);
      });//end readDir
    ///////// Routing localhost:3000/create_process /////////////////////
    }else if(pathname === '/create_process'){
      var body = '';
      //////// 사용자로부터 데이터가 들어오면 발생하는 이벤트 //////////
      request.on('data',function(data){
        body = body + data;  //조각조각 들어오는 데이터를 모음
        if(body.length > 1e6){
          request.connection.destroy(); //사용자 데이터의 양이 1*1000000 byte = 1 MB를 넘으면 연결을 끊어버림
        }
      });
      /////// 사용자의 데이터입력이 완료되면 발생하는 이벤트 //////////
      request.on('end',function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;

        fs.writeFile(`data/${title}`,description,function(err){
          if(err) throw err;
          response.writeHead(301,{Location: `/?id=${title}`});
          response.end('success!');
        });
        console.log(post);
      });
    ///////// Routing localhost:3000/create /////////////////////
    }else if(pathname === '/update'){
      fs.readdir('./data',function(err,fileList){
        fs.readFile(`data/${queryData.id}`,'utf8',function(err,fileContents){
          var title = queryData.id;
          var list = templeteLIST(fileList);
          var templete = templeteHTML(title,list,`<form class="" action="/update_process" method="post">
            <p><input type="hidden" name="id" value="${title}"></p>
            <p><input type="text" name="title" value="${title}"></p>
            <p><textarea name="description" rows="8" cols="80" placeholder="description" >${fileContents}</textarea></p>
            <p><input type="submit" name="" value=""></p>
          </form>`,'');
          response.writeHead(200);
          response.end(templete);
        });
      });//end readDir
    }else if(pathname === '/update_process'){
      var body = '';
      //////// 사용자로부터 데이터가 들어오면 발생하는 이벤트 //////////
      request.on('data',function(data){
        body = body + data;  //조각조각 들어오는 데이터를 모음
        if(body.length > 1e6){
          request.connection.destroy(); //사용자 데이터의 양이 1*1000000 byte = 1 MB를 넘으면 연결을 끊어버림
        }
      });
      /////// 사용자의 데이터입력이 완료되면 발생하는 이벤트 //////////
      request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        console.log(post);
        console.log(id);
        console.log(title);
        console.log(description);

        fs.rename(`data/${id}`,`data/${title}`,function(err){
          if(err){
            console.log('Change File name has been failed');
            throw err;
          }
          fs.writeFile(`data/${id}`,description,function(err){
            if(err) throw err;
            response.writeHead(301,{Location: `/?id=${id}`});
            response.end('success!');
          });
        });
      });
    ///////// Routing localhost:3000/update /////////////////////
    }else{
      response.writeHead(404);
      response.end('Not Found');
    }//end if else(pathname == '/')
});//end CreateServer
app.listen(80);
