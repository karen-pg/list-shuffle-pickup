let pickupLists = [];
let lists = [];
const listWrapper = document.querySelector("#task-wrapper");
const shuffleWrapper = document.querySelector("#shuffle-wrapper");

// ピックアップ数確認
const pickup = document.querySelector("#pickup");
function sortingCheckbox(eitherArray, pickNum) {
  if (
    pickNum >= eitherArray.length
      ? alert("リストの数より小さい数字を指定してください。")
      : shuffle(eitherArray, pickup.textContent, pickNum)
  );
}

// 乱数
function randomNum(array) {
  const r = Math.floor(Math.random() * array.length);
  return r;
}
//シャッフル
function shuffle(array, src, pickNum) {
  const randomArray = [...array];
  for (let i = randomArray.length - 1; i >= 0; i--) {
    const r = randomNum(randomArray);
    [randomArray[i], randomArray[r]] = [randomArray[r], randomArray[i]];
  }
  switch (src) {
    case "シャッフル":
      if (
        array === lists
          ? listInsert(randomArray, shuffleWrapper, "sh")
          : listInsert(randomArray, pickupWrapper, "pk")
      );
      break;
    case "ピックアップ":
      listPickup(randomArray, pickNum);
      break;
  }
}

// ピックアップ発火準備
const pickupWrapper = document.querySelector("#pickup-wrapper");
const listPickup = (randomArray, pickNum) => {
  const _randomArray = randomArray;
  pickupLists.splice(0);
  for (let i = pickNum - 1; i >= 0; i--) {
    const r = randomNum(_randomArray);
    !pickupLists.includes(_randomArray[r])
      ? pickupLists.push(_randomArray[r])
      : i++;
  }
  pickupLists.sort((a, b) => {
    return a - b;
  });
  listInsert(pickupLists, pickupWrapper, "pk");
};

// 発火（エレメント生成・チェックボックス切り替え）
const text = document.querySelector("#text");
const elementPrepare = (list) => {
  listInsert(list, listWrapper);
  text.value = "";
};

// ピックアップされたリストを生成
const sum = document.querySelector("#sum");
function listInsert(picklist, wrapper, cls = "li") {
  wrapper.innerHTML = "<ul>";
  picklist.forEach((list) => {
    return (wrapper.firstChild.innerHTML += `<li>${list}<input type="button" class="removeBtn ${cls}" onclick="listRemove(this)" value="削除"></input></li>`);
  });
  pickupLists.length
    ? (sum.innerHTML = `${pickupLists.length}/${lists.length}`)
    : (sum.innerHTML = lists.length);
  usefulCheckbox(pickupLists);
}

// チェックボックス有効・無効化
const pickupCheckbox = document.querySelector("#pickup-checkbox");
function usefulCheckbox(lists) {
  if (lists.length > 1) {
    pickupCheckbox.disabled = false;
  } else {
    pickupCheckbox.checked = false;
    pickupCheckbox.disabled = true;
  }
}

// コンソールで入力
function num(min, max) {
  for (let i = min; i <= max; i++) {
    lists.push(String(i));
  }
  elementPrepare(lists, listWrapper, "li");
}

// クリックイベント＊＊＊＊＊

// 追加
const addBtn = document.querySelector("#addBtn");
addBtn.addEventListener("click", () => {
  let list = text.value;
  if (list && list.match(/;|；/)) {
    const splitValue = list.split(/;|；/);
    lists.push(...splitValue);
    lists = lists.filter((v) => v);
    elementPrepare(lists);
  } else if (list) {
    lists.push(list);
    elementPrepare(lists);
  } else {
    alert("テキストフィールドに入力してください。");
  }
});

// シャッフル
const listShuffle = document.querySelector("#list-shuffle");
const pickupShuffle = document.querySelector("#pickup-shuffle");
listShuffle.addEventListener("click", function () {
  shuffle(lists, this.textContent);
});
pickupShuffle.addEventListener("click", function () {
  shuffle(pickupLists, this.textContent);
});

// ピックアップ
const pickupText = document.querySelector("#pickup-text");
pickup.addEventListener("click", () => {
  const pickNum = pickupText.value;
  if (pickNum && pickNum.match(/^[1-9]+$/)) {
    if (pickupCheckbox.checked) {
      sortingCheckbox(pickupLists, pickNum);
    } else {
      sortingCheckbox(lists, pickNum);
    }
  } else {
    alert("【1以上の半角数字】を入力してください。");
  }
});

// リセット
const reset = document.querySelector("#reset");
const pickupReset = document.querySelector("#pickup-reset");
reset.addEventListener("click", () => {
  pickupLists.splice(0);
  pickupText.value = shuffleWrapper.innerHTML = "";
  commonFn();
});
pickupReset.addEventListener("click", () => {
  listInsert(pickupLists, pickupWrapper, "pk");
});

// 配列から削除
function arrayRemove(array, removeValue) {
  const removeIndex = array.indexOf(removeValue);
  array.splice(removeIndex, 1);
}
// 削除
function listRemove(target) {
  const removeValue = target.parentNode.textContent;
  if (target.classList.contains("li")) {
    arrayRemove(lists, removeValue);
    listInsert(lists, listWrapper);
  } else {
    arrayRemove(pickupLists, removeValue);
    listInsert(pickupLists, pickupWrapper, "pk");
  }
  sum.innerHTML = lists.length;
}
// ピックアップをリストから削除
const rfl = document.querySelector("#remove-from-list");
rfl.addEventListener("click", () => {
  if (
    confirm(
      `${pickupLists}をリストから削除します。\n（削除したリストは元に戻せません）`
    )
  ) {
    pickupLists.forEach((list) => {
      arrayRemove(lists, list);
    });
    pickupLists.splice(0);
    commonFn();
  }
});

// 全消去
const allRemove = document.querySelector("#all-remove");
allRemove.addEventListener("click", () => {
  lists.splice(0);
  pickupLists.splice(0);
  pickupText.value = shuffleWrapper.innerHTML = "";
  commonFn();
});

const commonFn = () => {
  listInsert(lists, listWrapper);
  listInsert(pickupLists, pickupWrapper, "pk");
  sum.innerHTML = lists.length;
  usefulCheckbox(pickupLists);
};
