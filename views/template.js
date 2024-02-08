module.exports = {
    HTML: function (body = '', memberStatusUI = `
    <a href="/member/login">로그인</a>
    <a href="/member/signup">회원가입</a>
    `) {
        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/public/style.css">
            <title>게시판</title>
        </head>
        <body>
        <header id="topBar">
            <div id="logo">
                <h1><a href="/">게시판</a></h1>
            </div>
            <div id="search">
                <form action="/topic" method="post">
                    <input type="text" name="search" placeholder="제목/내용 검색"> 검색로고
                </form>
            </div>
            <div id="personal">
                ${memberStatusUI}
            </div>
        </header>
        <main>
            ${body}
        </main>
        <footer>
        copyright @ KIM
        </footer>
        </body>
        </html>
        `
    },
    topicList: function (topics) {
        let list = '<div id="topic_list">Topics<ul>';
        topics.forEach(topic => {
            list += `<li><a href="/topic/${topic.idx}">${topic.title}</a></li>`
        });
        list += '</ul>';
        return list;
    }, authorList: function (authors) {
        let list = '<div id="author_list">Authors<ul>';
        authors.forEach(author => {
            list += `<li><a href="/author/${author.id}">${author.id}</a></li>`
        });
        list += '</ul></div>';
        return list;
    },
    topicView: function (topic, owner = '') {
        return `
        <div id="topic_title"><h1 id="topic_title">${topic.title}</h1>${owner}</div>
        <div id="topic_author"><h5>by <a href="/author/${topic.User_id}">${topic.User_id}</a></h5></div>
        <div id="topic_description">
            <div>${topic.description}</div>
        </div>
        `;
    },
    authorTopicsList: function (author, topics) {
        let list = `<h1>${author}</h1>님이 쓰신 글 목록입니다. <ul>`;
        topics.forEach(topic => {
            list += `<li><a href="/topic/${topic.idx}">${topic.title}</a></li>`
        });
        list += '</ul>';
        return list;
    },
    authorSameMemeber: function (topic) {
        return ` | <h5><ul><li><a href="/topic/update/${topic.idx}">수정</a></li><li><a href="/topic/delete_process/${topic.idx}">삭제</a></li></ul></h5>`
    }
}