/*
    #HTML/CSS/JS TEST SPECIFICATION AND REQUIREMENTS
    
    ##YOU MUST NOT USE!!!
    - scripts you didn't write yourself
    - JS libraries and frameworks
    - CSS "frameworks"
    
    ##Page overals
    - Liquid layout NOT
    - max content wrapper width: 1280px, min widht: 800 
    - content centered on the page 
    - right column width: 30% of content wrapper
    - left column and right column padding 10px
    - page main title - embed font -> HelveticaInserat LT
    - Logo element should be fixed at all time at the left border of the page
    
    ##Dynamics
    - main navigation, drop down menu based on JS - don't use ready scripts
    - right column dynamic boxes:
        click to open, click to close
        two boxes must not be open in the same time 
    
    ##Cross-browser
    - 10+
    - FF
    - Chrome
    
    ##Language menu
    - hover makes flag opaque
    - selected flag is opaque
    
    ##Misc
    - font sizes and box sizes may be in %, px or em
    
    ##Your test does NOT qualifie for review if:
    - JSON content is not loaded with AJAX
    - We need to fiddle with your code to make it work
    - JS global scope is polluted
 

     ##Table Task:
     1. Your script must be able to handle number of columns dynamically (i.e. more or less columns, depending on the JSON sent)
     2. Do not use any ready scripts and libraries 
     3. Decide on the table HTML structure by yourself
     4. All your JS code MUST be into this file
     5. Bonus: Implement sorting on the column headers
     6. Get content with XMLHTTP request from here: http://cn.sbtech.com/sb-test/content.json
*/

document.addEventListener("DOMContentLoaded", function () {

    var _table_ = document.createElement('table'),
        _tbody_ = document.createElement('tbody'),
        _thead_ = document.createElement('thead'),
        _tr_ = document.createElement('tr'),
        _th_ = document.createElement('th'),
        _td_ = document.createElement('td');

    //resize height
    function resize() {
        var left = document.querySelector('.left').offsetHeight,
            right = document.querySelector('.right'),
            container = document.querySelector('section .container');

        right.style.height = left + 'px';
        container.style.minHeight = left + 'px';
    };

    //fancy click
    function Activation(target) {
        var target, el, makeActive;

        target = target;

        el = document.querySelectorAll(target);

        makeActive = function () {
            for (var i = 0; i < el.length; i++)
                el[i].classList.remove('active');

            this.classList.add('active');
        };

        for (var i = 0; i < el.length; i++)
            el[i].addEventListener('mousedown', makeActive);
    }

    //table build
    function buildTheTable(arr) {
        var table = _table_.cloneNode(false),
            tbody = _tbody_.cloneNode(false),
            columns = addAllColumnHeaders(arr, table);
        table.appendChild(tbody);
        for (var i = 0, maxi = arr.length; i < maxi; ++i) {
            var tr = _tr_.cloneNode(false);
            for (var j = 0, maxj = columns.length; j < maxj ; ++j) {
                var td = _td_.cloneNode(false);
                cellValue = arr[i][columns[j]];
                td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        return table;
    }

    function addAllColumnHeaders(arr, table) {
        var columnSet = [],
            thead = _thead_.cloneNode(false),
            tr = _tr_.cloneNode(false);
        thead.appendChild(tr);
        for (var i = 0, l = arr.length; i < l; i++) {
            for (var key in arr[i]) {
                if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                    columnSet.push(key);
                    var th = _th_.cloneNode(false);
                    th.appendChild(document.createTextNode(key));
                    tr.appendChild(th);
                }
            }
        }
        table.appendChild(thead);
        return columnSet;
    }

    //Event listener for width resize
    function addEvent(object, type, callback) {
        if (object == null || typeof (object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on" + type] = callback;
        }
    };

    addEvent(window, "resize", function (event) {
        resize();
    });

    //table sorting
    function sort(table, col, rev) {
        var tb = table.tBodies[0],
            tr = Array.prototype.slice.call(tb.rows, 0),
            i;
        rev = -((+rev) || -1);
        tr = tr.sort(function (a, b) {
            return rev
                * (a.cells[col].textContent.trim()
                    .localeCompare(b.cells[col].textContent.trim())
                   );
        });
        for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]);
    }

    function detectSort(table) {
        var th = table.tHead, i;
        th && (th = th.rows[0]) && (th = th.cells);
        if (th) i = th.length;
        else return;
        while (--i >= 0) (function (i) {
            var dir = 1;
            th[i].addEventListener('click', function () { sort(table, i, (dir = 1 - dir)) });
        }(i));
    }

    function sortTable(parent) {
        parent = parent || document.body;
        var t = parent.getElementsByTagName('table'), i = t.length;
        while (--i >= 0) detectSort(t[i]);
    }

    //ajax
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);

            document.getElementById("table").appendChild(buildTheTable(myArr)); //create table
            sortTable(); // invoke sorting
            resize();// invoke resize of height
        }
    };
    xmlhttp.open("GET", "http://cn.sbtech.com/sb-test/content.json", true);
    xmlhttp.send(null);

    Activation('.fancy-ul li');
    Activation('.langs-menu li');
});
