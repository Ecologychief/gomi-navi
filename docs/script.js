// --- クイズデータ ---
// 各質問と選択肢、および結果情報を定義
const quizData = {
  // --- 質問ノード ---
  start: {
    question: "捨てたいゴミは主に何ですか？",
    options: [
      { text: "木材・べニア板", next: "q_wood" },
      { text: "紙類・段ボール", next: "q_paper" },
      { text: "プラスチック・ビニール", next: "q_plastic" },
      { text: "金属類", next: "q_metal" },
      { text: "布・テープ・紐・ペンキなど", next: "q_fabric_etc" },
      { text: "上記以外のゴミ", next: "q_other" }, // 文言調整
    ],
  },
  // --- 木材 ---
  q_wood: {
    question: "大きさは？",
    options: [
      // ①矢場南へ行く「ゴミ袋に入る可燃物」に含まれる木屑
      { text: "ゴミ袋に入る (木屑など)", next: "result_1" },
      { text: "ゴミ袋に入らない大きさ", next: "q_wood_condition" },
    ],
  },
  q_wood_condition: {
    // 注意喚起を質問文に含める
    question: "状態と具体的な大きさは？\n\n(※木材、べニア板に刺さっている釘や金具は抜いてください)",
    options: [
      // ④サッカーゴール裏倉庫 (リサ木)
      { text: "【リサイクル可】 状態が良く、50cm以上の角材 または 90×90cm以上のべニア板", next: "result_4" },
      // ➂新部室棟南可燃物コンテナ
      { text: "【ゴミ】 状態が悪い、または、上記より小さいサイズ (50cm未満の角材、90×90cm未満のべニア板など)", next: "result_3" },
    ],
  },
  // --- 紙類 ---
  q_paper: {
    question: "種類と状態は？",
    options: [
      // ⑤西駐輪場一階・ピロティ (紙資源)
      { text: "【資源】 広告ボーン、広告、新聞紙、ラップの芯、着色のない段ボール (※テープ等は除去済)", next: "result_5" },
      // ➂新部室棟南可燃物コンテナ (ゴミ袋に入らない大きさの可燃物)
      { text: "【ゴミ】 着色のある段ボール (ゴミ袋に入らない大きさ)", next: "result_3" },
      // ①矢場南 (ゴミ袋に入る可燃物)
      { text: "【ゴミ】 養生付き広告ボーン", next: "result_1" },
      // ①矢場南 (ゴミ袋に入る可燃物)
      { text: "【ゴミ】 その他の紙ゴミ (ゴミ袋に入る)", next: "result_1" },
    ],
  },
  // --- プラスチック ---
  q_plastic: {
    question: "具体的な種類は？",
    options: [
      { text: "ペットボトル", next: "q_plastic_pet" },
      // ④サッカーゴール裏倉庫
      { text: "塩ビパイプ", next: "result_4" },
      // ②新部室棟南不可燃物コンテナ
      { text: "硬質プラスチック、状態の悪いプラスチック", next: "result_2" },
       // ①矢場南 (ゴミ袋に入る可燃物)
      { text: "ビニール袋、養生テープ", next: "result_1" },
    ],
  },
  q_plastic_pet: {
    question: "ペットボトルの着色は？",
    options: [
       // ①矢場南 (着色のあるペットボトル)
      { text: "あり", next: "result_1" },
       // ②新部室棟南不可燃物コンテナ (着色のないペットボトル)
      { text: "なし", next: "result_2" },
    ],
  },
  // --- 金属 ---
  q_metal: {
    question: "具体的な種類は？",
    options: [
      // ⑥東駐輪場東
      { text: "クランプ類 (直行クランプ、自在クランプ、C型ジョイント、プレートベース)", next: "result_6" },
      // ②新部室棟南不可燃物コンテナ
      { text: "針金、金具", next: "result_2" },
      // ②新部室棟南不可燃物コンテナ
      { text: "中身のないペンキ缶", next: "result_2" },
    ],
  },
  // --- 布・テープ・紐・ペンキなど ---
  q_fabric_etc: {
    question: "まだ使えそうですか？ (ペンキ、布、養生テープ、ガムテープ、紐、結束バンド、針金、接着剤など)",
    options: [
      // ⑦運営倉庫(新体育館前)
      { text: "はい、使えます (消耗品として回収)", next: "result_7" },
      // ①矢場南 (ゴミ袋に入る可燃物)
      { text: "いいえ、ゴミです (ゴミ袋に入る)", next: "result_1" },
       // ➂新部室棟南可燃物コンテナ (ゴミ袋に入らない大きさの可燃物 - 大きな布などを想定)
      { text: "いいえ、ゴミです (ゴミ袋に入らない)", next: "result_3" },
    ],
  },
   // --- その他 ---
   q_other: {
     question: "ゴミ袋に入りますか？",
     options: [
       // ①矢場南
       { text: "はい", next: "result_1" },
       { text: "いいえ", next: "q_other_type" },
     ],
   },
   q_other_type: {
     question: "主な素材は？ (ゴミ袋に入らない大きさのもの)",
     options: [
       // ➂新部室棟南可燃物コンテナ
       { text: "可燃物 (例: 大きな布、状態が悪くリサイクルできない木材片など)", next: "result_3" },
       // ②新部室棟南不可燃物コンテナ
       { text: "不燃物 (例: 大きなプラスチック片、金属片など)", next: "result_2" },
     ],
   },

  // --- 結果データ ---
  // result_X というIDで結果を定義
  result_1: {
    location: "①矢場南",
    items: "ゴミ袋に入る可燃物(紙類、木屑、ガムテープ、ビニール袋、養生テープ、着色のあるペットボトル、養生付き広告ボーン、残っていないテープ)",
    notes: "※ゴミ袋は各自で用意してください",
    image: "images/map1.png",
  },
  result_2: {
    location: "②新部室棟南不可燃物コンテナ",
    items: "不燃物(中身のないペンキ缶、硬質プラスチック、針金、金具、状態の悪いプラスチック、着色のないペットボトル)",
    notes: null, // 注意事項がない場合は null
    image: "images/map2.png",
  },
  result_3: {
    location: "➂新部室棟南可燃物コンテナ",
    items: "ゴミ箱に入らない大きさの可燃物(着色のある段ボール、状態の悪い木材、状態の悪いべニア板、50cm未満の角材、90×90cm未満のべニア板)",
    notes: "※木材、べニア板に刺さっている釘や金具は抜いてください",
    image: "images/map3.png",
  },
  result_4: {
    location: "④サッカーゴール裏倉庫",
    items: "リサ木(50cm以上の角材、90×90cm以上のべニア板)、塩ビ",
    // 注意事項は改行(\n)を含めてそのまま記述
    notes: "※2.0m以上の塩ビは二人で運ぶこと\n　塩ビは10本単位で養生やビニール紐でまとめてください\n※べニア板は未加工と加工済みに分けること\n　木材に刺さっている釘や金具は抜いてください\n　状態によっては可燃物になるため、その場の運営委員の指示に従ってください\n　破損の場合はエコ主任・副主任に連絡すること",
    image: "images/map4.png",
  },
   result_5: {
    location: "⑤西駐輪場一階・ピロティ",
    items: "紙資源(広告ボーン、広告、新聞紙、ラップの芯、着色のない段ボール)",
    notes: "※未着色のもののみ回収します\n　段ボールなどを縛る場合は紙紐で縛ってください\n　広告ボーンはうんどう会へ流用しても構いません\n　養生などのテープは除くこと",
    image: "images/map5.png",
  },
   result_6: {
    location: "⑥東駐輪場東",
    items: "クランプ類(直行クランプ、自在クランプ、C型ジョイント、プレートベース)",
    notes: "※絶対に紛失しないこと‼\n念入りに過不足を確認してから運んでください。トラブルのもととなります\n最初に入っていた袋にそのまま入れて運んで来てください\n破損の場合はエコ主任・副主任に連絡すること",
    image: "images/map6.png",
  },
  result_7: {
    location: "⑦運営倉庫(新体育館前)",
    items: "使える消耗品(ペンキ、布、養生テープ、ガムテープ、紐、結束バンド、針金、接着剤)",
    notes: "※回収するかどうかはその場の運営委員の指示に従ってください",
    image: "images/map7.png",
  },
};

// --- DOM要素取得 ---
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const backButton = document.getElementById('back-button');
const resetButton = document.getElementById('reset-button');
const resetButtonResult = document.getElementById('reset-button-result');

const resultLocation = document.getElementById('result-location');
const resultItems = document.getElementById('result-items');
const resultNotesContainer = document.getElementById('result-notes-container');
const resultNotes = document.getElementById('result-notes');
const resultMap = document.getElementById('result-map');

// --- アプリ状態管理 ---
let currentQuestionId = 'start'; // 現在表示中の質問ID
let history = []; // 質問の履歴を保持する配列 (戻る機能用)

// --- 関数定義 ---

/**
 * 指定されたIDの質問を表示する関数
 * @param {string} questionId 表示する質問のID
 */
function showQuestion(questionId) {
    // 結果表示を隠し、質問表示を表示
    questionContainer.style.display = 'block';
    resultContainer.style.display = 'none';

    const questionData = quizData[questionId];

    // データ存在チェック
    if (!questionData || !questionData.question) {
        console.error("エラー: 質問データが見つかりません:", questionId);
        resetQuiz(); // エラー時は最初に戻る
        return;
    }

    // 質問文を表示 (改行を反映させるためにtextContentを使用)
    questionText.textContent = questionData.question;
    // 既存の選択肢ボタンをクリア
    optionsContainer.innerHTML = '';

    // 新しい選択肢ボタンを生成して追加
    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('button'); // スタイル適用
        // ボタンクリック時の処理を設定
        button.onclick = () => handleAnswer(questionId, option.next);
        optionsContainer.appendChild(button);
    });

    // 履歴があれば「ひとつ戻る」ボタンを表示
    backButton.style.display = history.length > 0 ? 'inline-block' : 'none';
}

/**
 * 指定されたIDの結果を表示する関数
 * @param {string} resultId 表示する結果のID
 */
function showResult(resultId) {
     // 質問表示を隠し、結果表示を表示
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const resultData = quizData[resultId];

     // データ存在チェック
     if (!resultData || !resultData.location) {
        console.error("エラー: 結果データが見つかりません:", resultId);
        resetQuiz(); // エラー時は最初に戻る
        return;
    }

    // 結果情報を表示
    resultLocation.textContent = resultData.location;
    resultItems.textContent = resultData.items;

    // 注意事項があれば表示、なければ非表示
    if (resultData.notes) {
        resultNotes.textContent = resultData.notes; // textContentで改行も反映
        resultNotesContainer.style.display = 'block';
    } else {
        resultNotes.textContent = '';
        resultNotesContainer.style.display = 'none';
    }

    // 地図画像を表示
    resultMap.src = resultData.image;
    resultMap.alt = `${resultData.location} の地図`; // 代替テキスト設定
}

/**
 * 回答ボタンがクリックされたときの処理
 * @param {string} answeredQuestionId 回答した質問のID
 * @param {string} nextId 次に表示する質問 or 結果のID
 */
function handleAnswer(answeredQuestionId, nextId) {
    history.push(answeredQuestionId); // 現在の質問IDを履歴に追加

    // 次が結果か質問かで処理を分岐
    if (nextId.startsWith('result_')) {
        showResult(nextId); // 結果表示関数を呼び出し
    } else {
        currentQuestionId = nextId; // 現在の質問IDを更新
        showQuestion(currentQuestionId); // 次の質問表示関数を呼び出し
    }
     // 画面上部にスクロール(スマホで見やすくするため)
    window.scrollTo(0, 0);
}

/**
 * 「ひとつ戻る」ボタンがクリックされたときの処理
 */
function goBack() {
    if (history.length > 0) {
        const previousQuestionId = history.pop(); // 履歴から最後の質問IDを取り出す
        currentQuestionId = previousQuestionId; // 現在の質問IDを戻す
        showQuestion(currentQuestionId); // 前の質問を再表示
         window.scrollTo(0, 0); // スクロール
    }
}

/**
 * 「最初に戻る」ボタンがクリックされたときの処理
 */
function resetQuiz() {
    history = []; // 履歴をクリア
    currentQuestionId = 'start'; // 最初の質問IDに設定
    showQuestion(currentQuestionId); // 最初の質問を表示
     window.scrollTo(0, 0); // スクロール
}

// --- イベントリスナー設定 ---
backButton.addEventListener('click', goBack);
resetButton.addEventListener('click', resetQuiz);
resetButtonResult.addEventListener('click', resetQuiz); // 結果画面の「最初に戻る」ボタン

// --- 初期表示 ---
// ページ読み込み時に最初の質問を表示
showQuestion(currentQuestionId);