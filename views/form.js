module.exports = {
    login: `
    <form action="/member/login_process" method="post">
    <fieldset>
        <section>
            <label for="id">아이디</label>
            <input name="id" type="text" autocomplete="id" required autofocus>
        </section>
        <section>
            <label for="password">비밀번호</label>
            <input name="password" type="password" autocomplete="password" required>
        </section>
        <button type="submit">로그인</button>
        <a href="/">취소</a>
    </fieldset>
    </form>
    `,
    signup: `
    <form action="/member/signup_process" method="post">
        <section>
            <label for="id">아이디</label>
            <input name="id" type="text" autocomplete="id" required autofocus>
        </section>
        <section>
            <label for="password">비밀번호</label>
            <input name="password" type="password" autocomplete="password" required>
        </section>
        <section>
            <label for="password_check">비밀번호 확인</label>
            <input name="password_check" type="password" autocomplete="password_check" required>
        </section>
        <section>
            <label for="email">이메일</label>
            <input name="email" type="email" autocomplete="email" required>
        </section>
        <button type="submit">회원가입</button>
        <a href="/">취소</a>
    </form>
    `,
    updateMember: function (request) {
        return `
        <form action="/member/update_process" method="post">
        <section>
            <label for="id">아이디</label>
            ${request.session.nickname}
        </section>
        <section>
            <label for="password">비밀번호</label>
            <input name="password" type="password" autocomplete="password" required>
        </section>
        <section>
            <label for="password">비밀번호 확인</label>
            <input name="password" type="password" autocomplete="password" required>
        </section>
        <section>
            <label for="email">이메일</label>
            <input name="email" type="email" autocomplete="email" required>
        </section>
        <button type="submit">변경하기</button>
        <a href="/">취소</a>
    </form>
        `;
    }
    ,
    createTopic: function () {
        return `
    <form action="/topic/create" method="post">
        <fieldset>
            <section>
                <input name="title" placeholder="제목">
            </section>
            <section>
                <textarea name="description" placeholder="내용"></textarea>
            </section>
            <section>
                <input type="submit" value="글 작성">
                <button>취소</button>
            </section>
        </fieldset>
    </form>
    `;
    },
    updateTopic: function (title, description, paramId) {
        return `
    <form action="/topic/update/${paramId}" method="post">
        <fieldset>
            <label><input name="title" placeholder="제목" value=${title}></label>
            <label><textarea name="description" placeholder="내용">${description}</textarea></label>
            <input type="submit" value="글 작성">
            <button>취소</button>
        </fieldset>
    </form>
    `;
    }
}
