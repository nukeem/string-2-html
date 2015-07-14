function html() {
    function Parser() {
        this.tokens = [
            {search: [" "], apply: "SPACE"},
            {search: ["'", '"'], apply: "QUOTE"},
            {search: ["#"], apply: "HASH"},
            {search: ["."], apply: "DOT"},
            {search: ["("], apply: "OBRACKET"},
            {search: [")"], apply: "CBRACKET"},
            {search: ["["], apply: "OSBRACKET"},
            {search: ["]"], apply: "CSBRACKET"},
            {search: ["{"], apply: "OCBRACKET"},
            {search: ["}"], apply: "CCBRACKET"},
            {search: ["="], apply: "EQUALS"}
        ];

        function lexer(str, tokens) {
            var results = [], word = ''; 
            function setItem(item) {
                if (item) {
                    setItem();
                    results.push(item);
                } else if(word !== '') {
                    results.push({string: word});
                    word = '';
                }
            }

            for (var i = 0, len = str.length; i < len; i++) {
                var found = false, item = {};
                for (var c = 0, clen = tokens.length; c < clen; c++) {
                    if (tokens[c].search.indexOf(str[i]) > -1) {
                        found = true;
                        item[tokens[c].apply] = str[i];
                        setItem(item)
                        break;
                    }
                }
                if (!found) { word += str[i]; }
            }
            setItem();
            return results;
        }

        this.parse = function parse(str) {
            var foundTokens = lexer(str, this.tokens);
            function search(item, start) {
                for(var i = start; i < foundTokens.length; i++) {
                    if (foundTokens[i][item]) return i;   
                }
                return -1;
            }
            function val(token) { return token[Object.keys(token)[0]] }

            //  For our purposes lexed[0] should always be the tagName
            var result = {attributes: {}, tagName: foundTokens[0].string, class: [] }
            for (var i = 1, len = foundTokens.length; i < len; i++) {
                var token = foundTokens[i];         

                if (token.HASH) {
                    result.attributes.id = foundTokens[i+1].string;
                    i += 1;
                }
                if (token.DOT) {
                    result.class.push(foundTokens[i+1].string);
                    i += 1;
                }
                if (token.OCBRACKET) {
                    var s = '', e = search("CCBRACKET", i), item = {};
                    for (var l = i + 1; l < e; l++) { s += val(foundTokens[l]) }
                    result.innerHTML = s;
                    i = e;
                }
                if (token.OBRACKET) {
                    var s = '', e = search("CBRACKET", i);
                    for (var l = i + 1; l < e; l++) { s += val(foundTokens[l]) }
                    result.value = s;
                    i = e;
                }
                if (token.OSBRACKET) {
                    var s = '', e = search("CSBRACKET", i), item = {};
                    for (var l = i + 1; l < e; l++) { s += val(foundTokens[l]) }
                    item = this.parse(s);
                    result.attributes[Object.keys(item)[0]] = val(item);
                    i = e;
                }
                if (token.EQUALS) {
                    var item = {};
                    var s = '';
                    for (var l = i +1; l < foundTokens.length; l++) { s += val(foundTokens[l]) }
                    item[val(foundTokens[i-1])] = s;
                    return item;   
                }
            }
            return result;
        }
    }

    this.add = function add (str, cb) {
        var parser = new Parser(), parsed = parser.parse(str);
        var d = document.createElement(parsed.tagName);
        if (parsed.class.length > 0) parsed.attributes.class = parsed.class.join(" ");
        for (var p in parsed.attributes) { d.setAttribute(p, parsed.attributes[p]) }
        if (parsed.innerHTML) { d.innerHTML = parsed.innerHTML; }
        if (cb instanceof Element) d.appendChild(cb);
        if (cb instanceof Array) {
            for (var i = 0; i < cb.length; i++) { d.appendChild(cb[i]) }
        }
        if (typeof cb == "function") { cb.call(d) }
        return d;  
    }
};
