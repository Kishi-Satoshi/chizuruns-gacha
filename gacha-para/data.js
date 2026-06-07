// ===== ガチャ設定（ここを編集すれば中身を変えられます）=====
// rarity: 'SP'=あたり(レインボー) / 'R'=レア / 'N'=通常
// w: 同レアリティ内の重み（小さいほど出にくい＝人気キャラを希少に）
// img: キャラ画像のパス（公式素材に差し替え可）
//
// RARITY の各値:
//   tier   … 出現率(%)。SP→R→N の宣言順がレア度の順序になります。
//   label/stars/cls … 表示用。
//   演出（app.js が参照）: chargeCol=溜め色 / chargeMs=溜め時間(ms) /
//   chargeTop=溜め音の最高周波数 / shockCol=開封の衝撃波色 / sparks=きらめき数。

window.RARITY = {
  SP: { label: 'あたり',   stars: '★★★', cls: 'sp', tier: 5,  chargeCol: 'rgba(255,170,215,.7)',  chargeMs: 680, chargeTop: 1000, shockCol: '#ffd66b', sparks: 16 },
  R:  { label: 'レア',     stars: '★★',  cls: 'r',  tier: 25, chargeCol: 'rgba(255,200,70,.62)',  chargeMs: 680, chargeTop: 760,  shockCol: '#ffd66b', sparks: 10 },
  N:  { label: 'ノーマル', stars: '★',   cls: 'n',  tier: 70, chargeCol: 'rgba(110,175,255,.48)', chargeMs: 560, chargeTop: 520,  shockCol: '#bcd8ff', sparks: 5  },
};

window.COST = { single: 100, ten: 1000 };       // 1回 / 10連 のコイン
window.START = { coin: 12345, tic: 25 };          // 初期コイン / チケット
window.FEATURED = 'raburun';                      // PICK UP 表示キャラ

window.CHARS = [
  {
    "id": "ayanen",
    "name": "あやねん",
    "rarity": "SP",
    "color": "#ff5d9e",
    "w": 1,
    "trait": "優しくてかわいい、ぷにるんずの人気者♪",
    "img": "assets/characters/42.png"
  },
  {
    "id": "raburun",
    "name": "らぶるん",
    "rarity": "SP",
    "color": "#ff7ab0",
    "w": 1,
    "trait": "愛らしくてみんなの人気者！",
    "img": "assets/characters/07.png"
  },
  {
    "id": "yunirun",
    "name": "ゆにるん",
    "rarity": "R",
    "color": "#e7d6ff",
    "w": 1,
    "trait": "噂は知られているが、まだ誰も見たことがない伝説のぷにるん。",
    "img": "assets/characters/24.png"
  },
  {
    "id": "hikarun",
    "name": "ひかるん",
    "rarity": "R",
    "color": "#ffe066",
    "w": 2,
    "trait": "すごく恥ずかしがりやさん。光がみんなを元気にする。",
    "img": "assets/characters/22.png"
  },
  {
    "id": "enjerun",
    "name": "えんじぇるん",
    "rarity": "R",
    "color": "#fff0c2",
    "w": 2,
    "trait": "幸せの弓矢でみんなをポジティブにする。",
    "img": "assets/characters/23.png"
  },
  {
    "id": "debirun",
    "name": "でびるん",
    "rarity": "R",
    "color": "#ff6f9c",
    "w": 3,
    "trait": "すべて「えんじぇるん」と真逆のことをする。",
    "img": "assets/characters/26.png"
  },
  {
    "id": "utarun",
    "name": "うたるん",
    "rarity": "R",
    "color": "#ffd23f",
    "w": 4,
    "trait": "歌うことがとっても好き♪",
    "img": "assets/characters/15.png"
  },
  {
    "id": "sushirun",
    "name": "すしるん",
    "rarity": "R",
    "color": "#ffa45b",
    "w": 4,
    "trait": "ごきげんだとおすしに変身！",
    "img": "assets/characters/19.png"
  },
  {
    "id": "berirun",
    "name": "べりるん",
    "rarity": "R",
    "color": "#ff8fb6",
    "w": 5,
    "trait": "イチゴ柄がちょうオシャレ好き♥",
    "img": "assets/characters/16.png"
  },
  {
    "id": "pururin",
    "name": "ぷりるん",
    "rarity": "R",
    "color": "#ffc23d",
    "w": 5,
    "trait": "わが道を行く、ロック好き♪",
    "img": "assets/characters/39.png"
  },
  {
    "id": "tomorun",
    "name": "ともるん",
    "rarity": "R",
    "color": "#6fd3c9",
    "w": 6,
    "trait": "ともだち大すき！いつもワクワクをさがしている。",
    "img": "assets/characters/06.png"
  },
  {
    "id": "bebirun",
    "name": "べびるん",
    "rarity": "N",
    "color": "#bfe3ff",
    "w": 3,
    "trait": "赤ちゃんで甘えん坊。",
    "img": "assets/characters/01.png"
  },
  {
    "id": "airun",
    "name": "あいるん",
    "rarity": "N",
    "color": "#ff9eb5",
    "w": 3,
    "trait": "ポジティブでくいしんぼう♪",
    "img": "assets/characters/05.png"
  },
  {
    "id": "munyarun",
    "name": "むにゃるん",
    "rarity": "N",
    "color": "#8fdcc8",
    "w": 3,
    "trait": "いつもねむそうなのがかわいい！",
    "img": "assets/characters/40.png"
  },
  {
    "id": "paferun",
    "name": "ぱふぇるん",
    "rarity": "N",
    "color": "#bfe8ff",
    "w": 3,
    "trait": "さみしがりやのかまってちゃん！",
    "img": "assets/characters/41.png"
  },
  {
    "id": "akarun",
    "name": "あかるん",
    "rarity": "N",
    "color": "#ffb3c1",
    "w": 5,
    "trait": "ちょっこりお耳がかわいいね♥",
    "img": "assets/characters/02.png"
  },
  {
    "id": "kiirun",
    "name": "きいるん",
    "rarity": "N",
    "color": "#ffe14d",
    "w": 5,
    "trait": "ぼってりボディが愛らしい♥",
    "img": "assets/characters/03.png"
  },
  {
    "id": "aorun",
    "name": "あおるん",
    "rarity": "N",
    "color": "#5bb8ff",
    "w": 5,
    "trait": "まんまるお目目がキュート♪",
    "img": "assets/characters/04.png"
  },
  {
    "id": "enerun",
    "name": "えねるん",
    "rarity": "N",
    "color": "#ffd86b",
    "w": 5,
    "trait": "とても元気で運動がとくい！",
    "img": "assets/characters/08.png"
  },
  {
    "id": "ururun",
    "name": "うるるん",
    "rarity": "N",
    "color": "#c9d2dd",
    "w": 5,
    "trait": "泣き虫だけど絵がとくい♪",
    "img": "assets/characters/09.png"
  },
  {
    "id": "kuurun",
    "name": "くーるん",
    "rarity": "N",
    "color": "#b18cff",
    "w": 5,
    "trait": "いつもクールでキレイ好き！",
    "img": "assets/characters/10.png"
  },
  {
    "id": "kapurun",
    "name": "かぷるん",
    "rarity": "N",
    "color": "#9fe3d4",
    "w": 5,
    "trait": "おなかペコペコ。たべることが大すき。",
    "img": "assets/characters/11.png"
  },
  {
    "id": "runrun",
    "name": "るんるん",
    "rarity": "N",
    "color": "#f0dcc0",
    "w": 5,
    "trait": "前髪いのち。オタ活ちゅう！",
    "img": "assets/characters/12.png"
  },
  {
    "id": "zourun",
    "name": "ぞうるん",
    "rarity": "N",
    "color": "#8fd0ff",
    "w": 5,
    "trait": "こまり顔だけど、とてもやさしい♪",
    "img": "assets/characters/13.png"
  },
  {
    "id": "nyarurun",
    "name": "にゃるるん",
    "rarity": "N",
    "color": "#f3e2c0",
    "w": 5,
    "trait": "いつもマイペースでほっこり♪",
    "img": "assets/characters/14.png"
  },
  {
    "id": "piyorun",
    "name": "ぴよるん",
    "rarity": "N",
    "color": "#ffe14d",
    "w": 5,
    "trait": "とってもおしゃべり好き♪",
    "img": "assets/characters/17.png"
  },
  {
    "id": "ikarun",
    "name": "いかるん",
    "rarity": "N",
    "color": "#ffae7a",
    "w": 5,
    "trait": "みんなと仲良くなりたい。",
    "img": "assets/characters/18.png"
  },
  {
    "id": "puirun",
    "name": "ぷいるん",
    "rarity": "N",
    "color": "#ff8aa0",
    "w": 5,
    "trait": "怒りっぽいけど根はやさしい！",
    "img": "assets/characters/20.png"
  },
  {
    "id": "usarun",
    "name": "うさるん",
    "rarity": "N",
    "color": "#8fc8ff",
    "w": 5,
    "trait": "にんじん大好き♥負けず嫌い！",
    "img": "assets/characters/21.png"
  },
  {
    "id": "bearun",
    "name": "べあるん",
    "rarity": "N",
    "color": "#c0a3ff",
    "w": 5,
    "trait": "ゆるゆるぼんやりするのが好き♥",
    "img": "assets/characters/25.png"
  },
  {
    "id": "hapirun",
    "name": "はぴるん",
    "rarity": "N",
    "color": "#ffd0e6",
    "w": 5,
    "trait": "こっそりハッピーをとどける！",
    "img": "assets/characters/27.png"
  },
  {
    "id": "bakerun",
    "name": "ばけるん",
    "rarity": "N",
    "color": "#cfeaff",
    "w": 5,
    "trait": "こわがりなのに、おどろかすのが好き！",
    "img": "assets/characters/28.png"
  },
  {
    "id": "togerun",
    "name": "とげるん",
    "rarity": "N",
    "color": "#9be86a",
    "w": 5,
    "trait": "とげとげ頭のいたずらっ子！",
    "img": "assets/characters/29.png"
  },
  {
    "id": "pikarun",
    "name": "ぴかるん",
    "rarity": "N",
    "color": "#ffe066",
    "w": 5,
    "trait": "まじめでものしり！勉強が大好き♡",
    "img": "assets/characters/32.png"
  },
  {
    "id": "pururun",
    "name": "ぷるるん",
    "rarity": "N",
    "color": "#c3a8ff",
    "w": 5,
    "trait": "おだやかで、とても大人しい！",
    "img": "assets/characters/35.png"
  },
  {
    "id": "wafurun",
    "name": "わふるん",
    "rarity": "N",
    "color": "#ffb0d4",
    "w": 5,
    "trait": "むっとした顔だけど、おとぼけ！",
    "img": "assets/characters/36.png"
  },
  {
    "id": "nerurun",
    "name": "ねるるん",
    "rarity": "N",
    "color": "#ffe08a",
    "w": 5,
    "trait": "のんびりすごすのが心地いい♪",
    "img": "assets/characters/37.png"
  },
  {
    "id": "poirun",
    "name": "ぽいるん",
    "rarity": "N",
    "color": "#b8e886",
    "w": 5,
    "trait": "しっかり者に見えて、わすれんぼう！",
    "img": "assets/characters/38.png"
  }
];
