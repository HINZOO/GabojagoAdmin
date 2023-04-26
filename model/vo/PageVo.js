class PageVo {
    #totalRow;//조회된 게시글의 전체 수
    #totalPage;// 총 페이지 수[1,2,3] 네비게이션에 보이는 수
    #page;// current page
    #next;
    #prev;
    #isNext;
    #isPrev;
    #rowLength;//한페이지에 최대 글 수.
    #offset;// LIMIT offset,rowLength; // 시작점===startRow!
    #query;//page를 제외한 쿼리 //req.query={status:"PUBLIC",order:"b_id",page:"4"}을 -> status=PUBLIC&order=b_id& 로바꿔줌.
    #searchField;//검색할 칼럼
    #searchValue;//검색내용
    #orderField;//정렬
    #orderDirect;//정렬방향
    constructor(page, totalRow,reqQuery, rowLength = 5) {
        this.#page = page;
        this.#totalRow = totalRow;
        this.#rowLength = rowLength;
        this.#offset = (page - 1) * rowLength;
        this.#totalPage = Math.ceil(totalRow / rowLength);
        this.#next = page + 1;
        this.#prev = page - 1;
        this.#isNext = (this.#next <= this.#totalPage);
        this.#isPrev = (this.#prev >= 1);
        this.#query="";
        for(let key in reqQuery){
            if(key!=='page') {
                this.#query += `${key}=${reqQuery[key]}&`;
                //key!=="page" 조건에 만족해서 안으로 중첩시켜야 한다.
                if (key === 'field') {
                    this.#searchField = reqQuery[key];
                } else if (key === 'value') {
                    this.#searchValue = reqQuery[key];
                }else if(key==='orderField'){
                    this.#orderField=reqQuery[key];
                }else if(key==='orderDirect'){
                    this.#orderDirect=reqQuery[key];
                }
            }
        }
    }

    get offset() {
        return this.#offset;
    }

    set offset(value) {
        this.#offset = value;
    }

    get totalPage() {
        return this.#totalPage;
    }

    set totalPage(value) {
        this.#totalPage = value;
    }

    get next() {
        return this.#next;
    }

    set next(value) {
        this.#next = value;
    }

    get prev() {
        return this.#prev;
    }

    set prev(value) {
        this.#prev = value;
    }

    get isNext() {
        return this.#isNext;
    }

    set isNext(value) {
        this.#isNext = value;
    }

    get isPrev() {
        return this.#isPrev;
    }

    set isPrev(value) {
        this.#isPrev= value;
    }
    get rowLength(){
        return this.#rowLength;
    }
    get page(){
        return this.#page;
    }
    get totalRow(){
        return this.#totalRow;
    }
    get query(){
        return this.#query;
    }


    get searchField() {
        return this.#searchField;
    }

    set searchField(value) {
        this.#searchField = value;
    }

    get searchValue() {
        return this.#searchValue;
    }

    set searchValue(value) {
        this.#searchValue = value;
    }

    get orderField() {
        return this.#orderField;
    }

    set orderField(value) {
        this.#orderField = value;
    }

    get orderDirect() {
        return this.#orderDirect;
    }

    set orderDirect(value) {
        this.#orderDirect = value;
    }
}

module.exports=PageVo;