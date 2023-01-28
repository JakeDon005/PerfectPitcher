"use strict";
let context = new (window.AudioContext);
let 增益器 = context.createGain();
增益器.gain.value = 0.2;
增益器.connect(context.destination);
const 波形集合 = ['sawtooth', 'square', 'triangle', 'sine'];
const 音符 = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const modes = ['初级', '普通', '和弦'];
const 可用次数 = 3;
let unwatch集合 = [];
let 播放对象表 = [];
let g是否可按 = true;
let g是否按响 = false;
let g$正确的元素集合;
let g正确元素的索引集合;
function 获取随机整数(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function 键位音频计算(初始钢琴音区) {
    return 440 * Math.pow(2, (初始钢琴音区 - 46) / 12);
}
function 生成序列(from, to, step = 1) {
    let arr = [];
    for (let i = from; i < to; i += step) {
        arr.push(i);
    }
    return arr;
}
function 归并排序(arr) {
    if (arr.length < 2) {
        return arr;
    }
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    return 归并排序辅助(归并排序(left), 归并排序(right));
}
function 归并排序辅助(left, right) {
    const result = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        }
        else {
            result.push(right.shift());
        }
    }
    return result.concat(left, right);
}
function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    return arr;
}
function 序列洗牌(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        swap(arr, arr[i], arr[获取随机整数(0, i)]);
    }
    return arr;
}
function 数组比较(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    else {
        for (let i in arr1) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
            else {
                return true;
            }
        }
    }
}
function 播放对象(fr) {
    this.fr = fr;
    this.os = context.createOscillator();
    this.os.frequency.value = this.fr;
    this.os.type = 波形集合[获取随机整数(0, 波形集合.length)];
    this.os.start();
}
播放对象.prototype = {
    播放: function (延迟播放 = 0, 波形 = null) {
        this.os.type = 波形集合[获取随机整数(0, 波形集合.length)];
        if (波形) {
            this.os.type = 波形;
        }
        if (延迟播放) {
            setTimeout(() => {
                this.os.connect(增益器);
            }, 延迟播放);
        }
        else {
            this.os.connect(增益器);
        }
    },
    停止: function (延迟停止 = 0, 播放完成后执行 = () => { }) {
        if (延迟停止) {
            setTimeout(() => {
                this.os.disconnect(增益器);
                播放完成后执行();
            }, 延迟停止);
        }
        else {
            this.os.disconnect(增益器);
        }
    }
};
const vm = Vue.createApp({
    data() {
        return {
            mode: null,
            和弦数量: null,
            音域: null,
            基训数量: null,
            iftrain: null,
            trytimes: 3,
            modeEvens: [
                function (app) {
                    let 随机索引;
                    let 随机音源;
                    let $rightbtn;
                    function start(播放完成后执行 = () => { }) {
                        g$正确的元素集合 = [];
                        g正确元素的索引集合 = [];
                        随机索引 = 获取随机整数(0, 播放对象表.length);
                        $rightbtn = $(`#${随机索引}`);
                        g正确元素的索引集合.push(随机索引);
                        g$正确的元素集合.push($rightbtn);
                        随机音源 = 播放对象表[随机索引];
                        随机音源.播放();
                        随机音源.停止(500, 播放完成后执行);
                        app.iftrain = true;
                    }
                    function again(播放完成后执行 = () => { }) {
                        if (app.iftrain) {
                            随机音源.播放();
                            随机音源.停止(500, 播放完成后执行);
                        }
                    }
                    $("#start").unbind();
                    $("#again").unbind();
                    $("#start").bind('click', () => {
                        start();
                    });
                    $("#again").bind('click', function () {
                        again();
                    });
                    const unwatch基训数量 = app.$watch("基训数量", (nv) => {
                        app.通用重置化();
                        let $按钮生成区域 = $('#keyboard');
                        let 随机频率 = 获取随机整数(220, 880);
                        let 按钮生成总数 = app.基训数量;
                        let 打乱序列 = 序列洗牌(生成序列(0, 按钮生成总数));
                        const frag = [];
                        for (let i = 0; i < 按钮生成总数; ++i) {
                            播放对象表.push(new 播放对象(随机频率));
                            let $button = $(`<button id=${打乱序列[i]}>${i}</button>`);
                            $button.bind("touchstart", function () {
                                if (app.trytimes > 0 && g是否可按) {
                                    let index = Number(this.getAttribute('id'));
                                    app.通用核心逻辑([this], [index], start, again);
                                    播放对象表[index].播放();
                                    g是否按响 = true;
                                }
                            });
                            $button.bind("touchend", function () {
                                if (g是否按响) {
                                    播放对象表[Number(this.getAttribute('id'))].停止();
                                    g是否按响 = false;
                                }
                            });
                            随机频率 = 随机频率 + (随机频率 / 获取随机整数(6, 12));
                            frag.push($button);
                        }
                        $按钮生成区域.html('');
                        $按钮生成区域.append(frag);
                    });
                    unwatch集合.push(unwatch基训数量);
                    let value = app.基训数量 = 3;
                    let $w = $('#widgets');
                    $w.html('');
                    $w.append("<span class='label'>>数量</span>", $(`<input id=基训数量 >`));
                    let $滑块 = $('#基训数量');
                    $滑块.ionRangeSlider({
                        skin: 'mine'
                    });
                    $滑块.data("ionRangeSlider").update({
                        type: "single",
                        min: 2,
                        max: 7,
                        from: value,
                        onFinish: function (data) {
                            app.基训数量 = data.from;
                        }
                    });
                },
                function (app) {
                    let 随机索引;
                    let 随机音源;
                    let $rightbtn;
                    function start(播放完成后执行 = () => { }) {
                        g$正确的元素集合 = [];
                        g正确元素的索引集合 = [];
                        随机索引 = 获取随机整数(0, 播放对象表.length);
                        $rightbtn = $(`#${随机索引}`);
                        g正确元素的索引集合.push(随机索引);
                        g$正确的元素集合.push($rightbtn);
                        随机音源 = 播放对象表[随机索引];
                        随机音源.播放();
                        随机音源.停止(500, 播放完成后执行);
                        app.iftrain = true;
                    }
                    function again(播放完成后执行 = () => { }) {
                        if (app.iftrain) {
                            随机音源.播放();
                            随机音源.停止(500, 播放完成后执行);
                        }
                    }
                    $("#start").unbind();
                    $("#again").unbind();
                    $("#start").bind('click', () => {
                        start();
                    });
                    $("#again").bind('click', function () {
                        again();
                    });
                    const unwatch音域 = app.$watch("音域", (nv) => {
                        app.通用重置化();
                        let 十二键键位 = 0;
                        let 初始钢琴音区 = nv[0];
                        let 钢琴音区 = 初始钢琴音区;
                        let 按钮生成总数 = (nv[1] - 初始钢琴音区 + 1) * 12;
                        let $按钮生成区域 = $('#keyboard');
                        const frag = [];
                        for (let i = 0; i < 按钮生成总数; ++i) {
                            if (十二键键位 == 12) {
                                十二键键位 = 0;
                                ++钢琴音区;
                            }
                            播放对象表.push(new 播放对象(键位音频计算(i + 1 + (初始钢琴音区 - 1) * 12)));
                            let $button = $(`<button id=${i}>${钢琴音区 + 音符[十二键键位]}</button>`);
                            $button.bind("touchstart", function () {
                                if (app.trytimes > 0 && g是否可按) {
                                    let index = Number(this.getAttribute('id'));
                                    播放对象表[index].播放();
                                    app.通用核心逻辑([this], [index], start, again);
                                    g是否按响 = true;
                                }
                            });
                            $button.bind("touchend", function () {
                                if (g是否按响) {
                                    播放对象表[Number(this.getAttribute('id'))].停止();
                                    g是否按响 = false;
                                }
                            });
                            ++十二键键位;
                            frag.push($button);
                        }
                        $按钮生成区域.html('');
                        $按钮生成区域.append(frag);
                    });
                    unwatch集合.push(unwatch音域);
                    let range = app.音域 = [4, 5];
                    let $w = $('#widgets');
                    $w.html('');
                    $w.append("<span class='label'>>音域</span>", $(`<input id=音域 >`));
                    let $滑块 = $('#音域');
                    $滑块.ionRangeSlider({
                        skin: 'mine'
                    });
                    $滑块.data("ionRangeSlider").update({
                        type: 'double',
                        min: 2,
                        max: 7,
                        from: range[0],
                        to: range[1],
                        onFinish: function (data) {
                            app.音域 = [data.from, data.to];
                        }
                    });
                },
                function (app) {
                    let 随机索引集合 = [];
                    let $rightbtn集合 = [];
                    let 波形;
                    let 按钮生成总数;
                    let 顺序序列 = [];
                    function start(播放完成后执行 = () => { }) {
                        g$正确的元素集合 = [];
                        g正确元素的索引集合 = [];
                        波形 = 波形集合[获取随机整数(0, 音符.length)];
                        随机索引集合 = [];
                        $rightbtn集合 = [];
                        let 随机索引;
                        for (let i = 0; i < app.和弦数量; ++i) {
                            随机索引 = 顺序序列[获取随机整数(0, 按钮生成总数)];
                            随机索引集合.push(随机索引);
                            $rightbtn集合.push($(`#${随机索引}`));
                            let 随机音源 = 播放对象表[随机索引];
                            随机音源.播放(0, 波形);
                            随机音源.停止(500, 播放完成后执行);
                        }
                        g正确元素的索引集合 = 随机索引集合;
                        g$正确的元素集合 = $rightbtn集合;
                        app.iftrain = true;
                    }
                    function again(播放完成后执行 = () => { }) {
                        if (app.iftrain) {
                            波形 = 波形集合[获取随机整数(0, 音符.length)];
                            for (let i of 随机索引集合) {
                                let 随机音源 = 播放对象表[i];
                                随机音源.播放(0, 波形);
                                随机音源.停止(500, 播放完成后执行);
                            }
                        }
                    }
                    $("#start").unbind();
                    $("#again").unbind();
                    $("#start").bind('click', () => {
                        start();
                    });
                    $("#again").bind('click', () => {
                        again();
                    });
                    const unwatch音域 = app.$watch("音域", (nv) => {
                        app.通用重置化();
                        let 十二键键位 = 0;
                        let 初始钢琴音区 = nv[0];
                        let 钢琴音区 = 初始钢琴音区;
                        let 临时已按元素 = [];
                        let 临时已按序列 = [];
                        按钮生成总数 = (nv[1] - 初始钢琴音区 + 1) * 12;
                        顺序序列 = 生成序列(0, 按钮生成总数);
                        let $按钮生成区域 = $('#keyboard');
                        const frag = [];
                        for (let i = 0; i < 按钮生成总数; ++i) {
                            if (十二键键位 == 12) {
                                十二键键位 = 0;
                                ++钢琴音区;
                            }
                            播放对象表.push(new 播放对象(键位音频计算(i + 1 + (初始钢琴音区 - 1) * 12)));
                            let $button = $(`<button id=${i}>${钢琴音区 + 音符[十二键键位]}</button>`);
                            $button.bind("touchstart", function () {
                                if (app.trytimes > 0 && g是否可按) {
                                    if (app.iftrain) {
                                        this.style.backgroundColor = 'yellow';
                                    }
                                    let index = Number(this.getAttribute('id'));
                                    临时已按序列.push(index);
                                    临时已按元素.push(this);
                                    if (临时已按序列.length == app.和弦数量) {
                                        app.通用核心逻辑(临时已按元素, 临时已按序列, start, again);
                                        临时已按序列 = [];
                                        临时已按元素 = [];
                                    }
                                    播放对象表[index].播放();
                                    g是否按响 = true;
                                }
                            });
                            $button.bind("touchend", function () {
                                if (g是否按响) {
                                    播放对象表[Number(this.getAttribute('id'))].停止();
                                    g是否按响 = false;
                                }
                            });
                            ++十二键键位;
                            frag.push($button);
                        }
                        $按钮生成区域.html('');
                        $按钮生成区域.append(frag);
                    });
                    const unwatch和弦数量 = app.$watch('和弦数量', (nv) => {
                        app.iftrain = false;
                        app.trytimes = 可用次数;
                    });
                    unwatch集合.push(unwatch音域, unwatch和弦数量);
                    let range = app.音域 = [4, 5];
                    app.和弦数量 = 2;
                    let $w = $('#widgets');
                    $w.html('');
                    $w.append("<span class='label'>>音域</span>", $(`<input id=音域 >`), "<span class='label'>>和弦数量</span>", $(`<input id=和弦数量 >`));
                    let $滑块1 = $('#音域');
                    let $滑块2 = $('#和弦数量');
                    $滑块1.ionRangeSlider({
                        skin: 'mine'
                    });
                    $滑块1.data("ionRangeSlider").update({
                        type: 'double',
                        min: 2,
                        max: 7,
                        from: range[0],
                        to: range[1],
                        onFinish: function (data) {
                            app.音域 = [data.from, data.to];
                        }
                    });
                    $滑块2.ionRangeSlider({
                        skin: 'mine'
                    });
                    $滑块2.data("ionRangeSlider").update({
                        type: 'single',
                        min: 2,
                        max: 7,
                        from: app.和弦数量,
                        onFinish: function (data) {
                            app.和弦数量 = data.from;
                        }
                    });
                }
            ]
        };
    },
    computed: {
        nmode() {
            return modes[this.mode];
        },
        状态() {
            if (this.iftrain) {
                return "已开始";
            }
            else {
                return "未开始";
            }
        }
    },
    watch: {
        mode(nv) {
            if (unwatch集合[0]) {
                for (let i of unwatch集合) {
                    i();
                }
                unwatch集合 = [];
            }
            this.modeEvens[nv](this);
            this.通用重置化();
        }
    },
    methods: {
        通用重置化() {
            this.trytimes = 可用次数;
            this.iftrain = false;
            if (播放对象表[0]) {
                for (let i of 播放对象表) {
                    i.os.stop(context.currentTime);
                }
                播放对象表 = [];
            }
            g是否可按 = true;
            g是否按响 = false;
        },
        通用核心逻辑(已按的元素, 已按元素的索引, start, again) {
            if (this.iftrain) {
                if (数组比较(归并排序(已按元素的索引), 归并排序(g正确元素的索引集合))) {
                    g是否可按 = false;
                    for (let btn of 已按的元素) {
                        btn.style.backgroundColor = 'green';
                    }
                    setTimeout(() => {
                        for (let btn of 已按的元素) {
                            btn.removeAttribute("style");
                        }
                        start(() => {
                            g是否可按 = true;
                            this.trytimes = 可用次数;
                        });
                    }, 1000);
                }
                else {
                    this.trytimes -= 1;
                    g是否可按 = false;
                    for (let btn of 已按的元素) {
                        btn.style.backgroundColor = 'red';
                    }
                    setTimeout((thentrytime) => {
                        for (let btn of 已按的元素) {
                            btn.removeAttribute("style");
                        }
                        g是否可按 = true;
                        if (thentrytime == 0) {
                            for (let $rightbtn of g$正确的元素集合) {
                                $rightbtn.attr('style', 'background-color:green');
                            }
                            let 计数器 = 1;
                            again(() => {
                                if (计数器 == 1) {
                                    for (let $rightbtn of g$正确的元素集合) {
                                        $rightbtn.removeAttr('style');
                                    }
                                    setTimeout(() => {
                                        start(() => {
                                            this.trytimes = 可用次数;
                                        });
                                    }, 700);
                                }
                                ++计数器;
                            });
                            计数器 = 1;
                        }
                    }, 700, this.trytimes);
                }
            }
        }
    },
    mounted() {
        this.mode = 1;
        let app = this;
        $("#mode-selector").ionRangeSlider({
            skin: 'mine',
            min: 0,
            max: modes.length - 1,
            from: app.mode,
            force_edges: true,
            onFinish: function (data) {
                app.mode = data.from;
            },
            prettify: function (初始钢琴音区) {
                return modes[初始钢琴音区];
            }
        });
    }
}).mount("#app");
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
