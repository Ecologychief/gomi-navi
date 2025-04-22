document.addEventListener('DOMContentLoaded', () => {
    const questionTitle = document.getElementById('question-title');
    const optionsArea = document.getElementById('options-area');
    const instructionText = document.getElementById('instruction-text');
    const questionArea = document.getElementById('question-area');
    const resultArea = document.getElementById('result-area');
    const resultLocation = document.getElementById('result-location');
    const resultGarbageTypes = document.getElementById('result-garbage-types');
    const resultMap = document.getElementById('result-map');
    const resultNotesText = document.getElementById('result-notes-text');
    const backButton = document.getElementById('back-button');
    const resetButton = document.getElementById('reset-button');

    let currentState = 'start';
    let history = []; // 状態履歴を保存

    // ゴミの分類データ (フローチャートに基づき定義)
    const garbageData = {
        // 結果データ (場所、ゴミの種類、注意事項、画像ファイル名)
        results: {
            R1: { location: "➀矢場南", types: "ゴミ袋に入る可燃物(紙類、木屑、ガムテープ、ビニール袋、養生テープ、着色のあるペットボトル、養生付き広告ボーン、残っていないテープ)", notes: "※ゴミ袋は各自で用意してください", map: "map1.png" },
            R2: { location: "②新部室棟南不可燃物コンテナ", types: "不燃物(中身のないペンキ缶、硬質プラスチック、針金、金具、状態の悪いプラスチック、着色のないペットボトル)", notes: "", map: "map2.png" },
            R3: { location: "➂新部室棟南可燃物コンテナ", types: "ゴミ箱に入らない大きさの可燃物(着色のある段ボール、状態の悪い木材、状態の悪いべニア板、50cm未満の角材、90×90cm未満のべニア板)", notes: "※木材、べニア板に刺さっている釘や金具は抜いてください", map: "map3.png" },
            R4: { location: "④サッカーゴール裏倉庫", types: "リサ木(50cm以上の角材、90×90cm以上のべニア板)", notes: "※べニア板は未加工と加工済みに分けること\n　木材に刺さっている釘や金具は抜いてください\n　状態によっては可燃物になるため、その場の運営委員の指示に従ってください\n　破損の場合はエコ主任・副主任に連絡すること", map: "map4.png" },
            R4_sub: { location: "④サッカーゴール裏倉庫", types: "塩ビ", notes: "※2.0m以上の塩ビは二人で運ぶこと\n　塩ビは10本単位で養生やビニール紐でまとめてください\n※状態によっては不燃物になるため、その場の運営委員の指示に従ってください\n　破損の場合はエコ主任・副主任に連絡すること", map: "map4.png" }, // 塩ビ用に注意事項調整
            R5: { location: "⑤西駐輪場一階・ピロティ", types: "紙資源(広告ボーン、広告、新聞紙、ラップの芯、着色のない段ボール)", notes: "※未着色のもののみ回収します\n　段ボールなどを縛る場合は紙紐で縛ってください\n　広告ボーンはうんどう会へ流用しても構いません\n　養生などのテープは除くこと", map: "map5.png" },
            R6: { location: "⑥東駐輪場東", types: "クランプ類(直行クランプ、自在クランプ、C型ジョイント、プレートベース)", notes: "※絶対に紛失しないこと‼\n念入りに過不足を確認してから運んでください。トラブルのもととなります\n最初に入っていた袋にそのまま入れて運んで来てください\n破損の場合はエコ主任・副主任に連絡すること", map: "map6.png" },
            R7: { location: "⑦運営倉庫(新体育館前)", types: "使える消耗品(ペンキ、布、養生テープ、ガムテープ、紐、結束バンド、針金、接着剤)", notes: "※回収するかどうかはその場の運営委員の指示に従ってください", map: "map7.png" },
            R_Unknown: { location: "➀矢場南", types: "その他 / 不明なゴミ", notes: "※判断がつかない場合は、近くの運営委員に相談してください。\n※ゴミ袋は各自で用意してください", map: "map1.png" } // 不明な場合
        },
        // 質問データ
        questions: {
            start: {
                question: "捨てたいものは主に何ですか？",
                options: [
                    { text: "木材・ベニヤ板", next: "q_wood_size" },
                    { text: "紙類 (段ボール, 広告, 新聞紙など)", next: "q_paper_type" },
                    { text: "プラスチック (ペットボトル, 塩ビ, 袋など)", next: "q_plastic_type" },
                    { text: "金属 (クランプ, ペンキ缶, 金具など)", next: "q_metal_type" },
                    { text: "消耗品 (ペンキ, テープ, 布, 紐など)", next: "q_consumable_type" },
                    { text: "その他 / 不明", next: "R_Unknown" }
                ]
            },
            // --- 木材 ---
            q_wood_size: {
                question: "木材・ベニヤ板の大きさは？",
                options: [
                    { text: "50cm以上の角材 / 90x90cm以上のベニヤ板", next: "q_wood_large_condition" },
                    { text: "50cm未満の角材 / 90x90cm未満のベニヤ板", next: "q_wood_small_nail" },
                    { text: "木屑", next: "R1" }
                ]
            },
            q_wood_large_condition: {
                question: "【大きい木材/ベニヤ】釘や金具はついていますか？ 状態は？",
                 options: [
                    { text: "ついている / 状態が良い or 普通", next: "R4", instruction: "釘や金具を抜いてください" },
                    { text: "ついていない / 状態が良い or 普通", next: "R4" },
                    { text: "状態が悪い (破損など)", next: "R3", instruction: "状態が悪いため可燃物コンテナへ。\n念のため運営委員に確認してください。" }
                ]
            },
            q_wood_small_nail: {
                question: "【小さい木材/ベニヤ】釘や金具はついていますか？",
                options: [
                    { text: "ついている", next: "R3", instruction: "釘や金具を抜いてください" },
                    { text: "ついていない", next: "R3" }
                ]
            },
            // --- 紙類 ---
            q_paper_type: {
                question: "紙類の種類は？",
                options: [
                    { text: "段ボール", next: "q_paper_cardboard_color" },
                    { text: "広告ボーン", next: "q_paper_adbone_tape" },
                    { text: "広告 / 新聞紙 / ラップの芯", next: "R5" },
                    { text: "その他紙くず (メモ, ティッシュなど)", next: "R1" }
                ]
            },
            q_paper_cardboard_color: {
                question: "【段ボール】着色されていますか？",
                options: [
                    { text: "はい (着色あり)", next: "R3" },
                    { text: "いいえ (着色なし)", next: "R5" }
                ]
            },
            q_paper_adbone_tape: {
                question: "【広告ボーン】養生テープなどが付いていますか？",
                options: [
                    { text: "はい (養生付き)", next: "R1" },
                    { text: "いいえ (紙のみ)", next: "R5" }
                ]
            },
            // --- プラスチック ---
            q_plastic_type: {
                question: "プラスチックの種類は？",
                options: [
                    { text: "ペットボトル", next: "q_plastic_petbottle_color" },
                    { text: "塩ビパイプ", next: "R4_sub", instruction:"破損している場合は運営委員に相談し、指示に従ってください(不燃物コンテナの場合あり)" },
                    { text: "硬質プラスチック (バケツ片など)", next: "R2" },
                    { text: "ビニール袋 / 養生テープ (使用済み)", next: "R1" },
                    { text: "その他状態の悪いプラスチック", next: "R2" }
                ]
            },
             q_plastic_petbottle_color: {
                question: "【ペットボトル】着色されていますか？",
                options: [
                    { text: "はい (着色あり)", next: "R1" },
                    { text: "いいえ (透明)", next: "R2" }
                ]
            },
            // --- 金属 ---
             q_metal_type: {
                question: "金属の種類は？",
                options: [
                    { text: "クランプ類 (直行, 自在, C型ジョイント, プレートベース)", next: "R6" },
                    { text: "ペンキ缶 (中身なし)", next: "R2" },
                    { text: "針金 / 金具", next: "q_metal_wire_usable" }
                ]
            },
            q_metal_wire_usable: {
                question: "【針金・金具】まだ使えそうですか？",
                 options: [
                    { text: "はい (使える)", next: "R7" },
                    { text: "いいえ (使えない)", next: "R2" }
                ]
            },
            // --- 消耗品 ---
            q_consumable_type: {
                question: "消耗品の種類と状態は？",
                options: [
                    { text: "ペンキ (中身あり)", next: "R7" },
                    { text: "布", next: "R7" },
                    { text: "養生テープ / ガムテープ", next: "q_consumable_tape_usable" },
                    { text: "紐 / 結束バンド", next: "R7" },
                    { text: "針金 (使えるもの)", next: "R7" }, // 金属と重複するがこちらからも選択可能に
                    { text: "接着剤", next: "R7" },
                    { text: "上記以外 / 使い切り / ゴミ", next: "R1" }
                ]
            },
             q_consumable_tape_usable:{
                question: "【養生テープ/ガムテープ】まだ十分使えますか？",
                 options: [
                    { text: "はい (使える)", next: "R7" },
                    { text: "いいえ (使いかけ / ゴミ)", next: "R1" }
                ]
            }
        }
    };

    // 質問を表示する関数
    function displayQuestion(stateId) {
        const stateData = garbageData.questions[stateId];
        if (!stateData) return; // 存在しない状態なら何もしない

        currentState = stateId;
        questionTitle.textContent = stateData.question;
        optionsArea.innerHTML = ''; // 既存の選択肢をクリア
        instructionText.textContent = ''; // 指示をクリア
        instructionText.style.display = 'none';

        stateData.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.classList.add('option-button');
            button.addEventListener('click', () => handleAnswer(option));
            optionsArea.appendChild(button);
        });

        questionArea.style.display = 'block';
        resultArea.style.display = 'none';
        updateNavigationButtons();
    }

    // 結果を表示する関数
    function displayResult(resultId) {
        const resultData = garbageData.results[resultId];
        if (!resultData) return; // 存在しない結果なら何もしない

        currentState = resultId; // 結果も状態として記録
        resultLocation.textContent = resultData.location;
        resultGarbageTypes.textContent = `【対象ゴミ】 ${resultData.types}`;
        resultMap.src = `images/${resultData.map}`;
        resultMap.alt = `${resultData.location} の地図`;
        resultNotesText.textContent = resultData.notes || "(特に表示する注意事項はありません)"; // 注意事項が空の場合のテキスト

        questionArea.style.display = 'none';
        resultArea.style.display = 'block';
        updateNavigationButtons();
    }

    // 回答を処理する関数
    function handleAnswer(option) {
        // 指示がある場合は表示
        if (option.instruction) {
            instructionText.textContent = `【指示】 ${option.instruction}`;
            instructionText.style.display = 'block';
            // 指示を表示した後、すぐに次のステップに進む場合があるため、
            // ここで return せず、次の状態へ進む処理を続ける。
            // ※もし指示を確認してから進むボタンが必要なら、ここのロジックを変更
        } else {
            instructionText.textContent = '';
            instructionText.style.display = 'none';
        }

        // 現在の状態を履歴に追加
        history.push(currentState);

        const nextState = option.next;
        if (garbageData.questions[nextState]) {
            displayQuestion(nextState);
        } else if (garbageData.results[nextState]) {
            displayResult(nextState);
        }
    }

    // ナビゲーションボタンの状態を更新する関数
    function updateNavigationButtons() {
        if (history.length > 0) {
            backButton.style.display = 'inline-block';
        } else {
            backButton.style.display = 'none';
        }

        if (currentState !== 'start') {
            resetButton.style.display = 'inline-block';
        } else {
            resetButton.style.display = 'none';
        }
    }

    // 戻るボタンの処理
    backButton.addEventListener('click', () => {
        if (history.length > 0) {
            const prevState = history.pop();
            // 結果表示から戻る場合も考慮
            if (garbageData.questions[prevState]) {
                 displayQuestion(prevState);
            } else {
                 // もし結果表示の前に質問があったはずなので、さらに遡る
                 // (シンプルにするため、常に質問に戻る実装でも可)
                 if (history.length > 0) {
                     const prevQuestionState = history.pop();
                     displayQuestion(prevQuestionState);
                 } else {
                     displayQuestion('start'); // 履歴がなければ最初へ
                 }
            }
        }
    });

    // 最初に戻るボタンの処理
    resetButton.addEventListener('click', () => {
        history = []; // 履歴をクリア
        displayQuestion('start');
    });

    // 初期表示
    displayQuestion('start');

    // Service Workerの登録 (PWA対応)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js') // sw.jsのパスを適切に設定
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});