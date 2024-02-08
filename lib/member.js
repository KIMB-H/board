module.exports = {
    statusUI: function (request, response) {
        let memberStatusUI = `<a href="/member/login">로그인</a> | <a href="/member/signup">회원가입</a>`;

        if (this.isOwner(request, response)) {
            const nickname = request.session.nickname;
            memberStatusUI = `
        <a href="/member/${nickname}">프로필</a> ${nickname} | <a href="/member/logout">로그아웃</a>
        `
        }
        return memberStatusUI;
    }, isOwner: function (request, response) {
        if (request.session.is_logined) { //login에 성공
            return true;
        } else { //로그인에 실패
            return false;
        }
    }
}