let pickupLists = [];
let lists = [];
const listWrapper = document.querySelector("#task-wrapper");
const shuffleWrapper = document.querySelector("#shuffle-wrapper");

// ピックアップ数確認
const pickup = document.querySelector("#pickup");
function sortingCheckbox(eitherArray, pickNum) {
  pickNum >= eitherArray.length
    ? alert("リストの数より小さい数字を指定してください。")
    : shuffle(eitherArray, pickup.textContent, pickNum);
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
      array === lists
        ? listInsert(randomArray, shuffleWrapper, "sh")
        : listInsert(randomArray, pickupWrapper, "pk");
      break;
    case "ピックアップ":
      listPickup(randomArray, pickNum);
      break;
  }
}
// 乱数
function randomNum(array) {
  const r = Math.floor(Math.random() * array.length);
  return r;
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
  wrapper.innerHTML = "";

  picklist.forEach((list) => {
    const setAttributes = (el, attrs) => {
      Object.keys(attrs).forEach((key) => {
        el.setAttribute(key, attrs[key]);
      });
    };

    const listItem = document.createElement("li");
    const removeBtn = document.createElement("input");
    listItem.textContent = `${list.val} [${list.lev}]`;
    listItem.appendChild(removeBtn);
    setAttributes(removeBtn, {
      type: "button",
      class: `removeBtn ${cls} pointer`,
      onclick: "listRemove(this)",
      value: "×",
    });
    setAttributes(listItem, { id: list.id });
    wrapper.appendChild(listItem);
  });

  // pickupLists.length
  //   ? (sum.innerHTML = `${pickupLists.length}/${lists.length}`)
  sum.innerHTML = lists.length;

  if (!lists.length) {
    listWrapper.innerHTML = '<p class="list-attention">リストが登録されていません。</p>';
  }

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
let idNumber = 0;
addBtn.addEventListener("click", () => {
  const list = text.value;
  const level = document.querySelector("#level").value;
  // if (list && list.match(/;|；/)) {
  //   const splitValue = list.split(/;|；/);
  //   lists.push({ val: [...splitValue], lev: level });
  //   lists = lists.filter((v) => v);
  //   elementPrepare(lists);
  // } else if (list) {
  //   lists.push({ val: list, lev: level });
  //   elementPrepare(lists);
  // } else {
  //   alert("テキストフィールドに入力してください。");
  // }
  if (list) {
    lists.push({ id: idNumber, val: list, lev: level });
    elementPrepare(lists);
    idNumber++;
  } else {
    alert("テキストフィールドに入力してください。");
  }
});

// リスト開閉
window.onload = () => {
  const closeBtn = document.querySelector('#close-btn');
  const showBtn = document.querySelector('#show-btn');
  const listContainer = document.querySelector('#list-container');

  const modalBtns = [{ btn: closeBtn, style: 'none' }, { btn: showBtn, style: 'flex' }];

  modalBtns.forEach((target) => {
    target['btn'].addEventListener('click', () => {
      listContainer.style.display = target['style'];
      showBtnToggle();
    });
  });

  const showBtnToggle = () => {
    const listContainerStyle = getComputedStyle(listContainer, '').getPropertyValue('display');
    listContainerStyle === 'flex'
      ? showBtn.style.display = 'none'
      : showBtn.style.display = 'block';
  }

  showBtnToggle();
}

// シャッフル
const listShuffle = document.querySelector("#list-shuffle");
const pickupShuffle = document.querySelector("#pickup-shuffle");
listShuffle.addEventListener("click", function () {
  shuffle(lists, this.textContent);
});
pickupShuffle.addEventListener("click", function () {
  shuffle(pickupLists, this.textContent);
});

// // ピックアップ
const pickupText = document.querySelector("#pickup-text");
pickup.addEventListener("click", () => {
  const pickNum = pickupText.value;
  if (pickNum && pickNum.match(/^[1-9]+$/)) {
    pickupCheckbox.checked
      ? sortingCheckbox(pickupLists, pickNum)
      : sortingCheckbox(lists, pickNum);
  } else {
    alert("【1以上の半角数字】を入力してください。");
  }
});

// // リセット
// const reset = document.querySelector("#reset");
// const pickupReset = document.querySelector("#pickup-reset");
// reset.addEventListener("click", () => {
//   pickupLists.splice(0);
//   pickupText.value = shuffleWrapper.innerHTML = "";
//   commonFn();
// });
// pickupReset.addEventListener("click", () => {
//   listInsert(pickupLists, pickupWrapper, "pk");
// });

// // 配列から削除
function arrayRemove(array, removeId) {
  const removeList = array.find((list) => {
    return list.id === Number(removeId)
  });
  const index = array.indexOf(removeList);
  array.splice(index, 1);
}
// 削除
function listRemove(target) {
  const removeId = target.parentNode.id;
  if (target.classList.contains("li")) {
    arrayRemove(lists, removeId);
    listInsert(lists, listWrapper);
  } else {
    arrayRemove(pickupLists, removeId);
    listInsert(pickupLists, pickupWrapper, "pk");
  }
  sum.innerHTML = lists.length;
}
// ピックアップをリストから削除
const rfl = document.querySelector("#remove-from-list");
rfl.addEventListener("click", () => {
  if (pickupLists.length) {
    const val = pickupLists.forEach((list) => {
      return list.lav;
    })
    if (
      confirm(
        `${val}をリストから削除します。\n（削除したリストは元に戻せません）`
      )
    ) {
      pickupLists.forEach((list) => {
        arrayRemove(lists, list.id);
      });
      pickupLists.splice(0);
      commonFn();
    }
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
  // sum.innerHTML = lists.length;
  usefulCheckbox(pickupLists);
};

// グループ分け
const groupBtn = document.querySelector("#create-group-btn");
groupBtn.addEventListener("click", () => {
  const groupWrapper = document.querySelector("#group-wrapper");
  const groupNum = document.querySelector("#group-num").value;

  // テーブルを生成
  const createTable = (array) => {
    groupWrapper.innerHTML = "";
    const list = lists.length;
    const perGroup = Math.ceil(list / groupNum);

    // グループの数だけ繰り返す
    for (let i = 0; i < groupNum; i++) {
      const table = document.createElement("table");
      const thTr = document.createElement("tr");
      const th = document.createElement("th");
      th.innerText = `グループ${i + 1}`;
      thTr.appendChild(th);
      table.appendChild(thTr);

      // 1グループあたりのリスト数分繰り返す
      for (let d = 0; d < perGroup; d++) {
        const tdTr = document.createElement("tr");
        const td = document.createElement("td");

        if (array[i][d]) {
          td.textContent = `${array[i][d].val} [${array[i][d].lev}]`;
          tdTr.appendChild(td);
          table.appendChild(tdTr);
        }
        groupWrapper.appendChild(table);
      }
    }
  };

  // グループ分けをした配列を渡す
  const grouping = (groupNum, array) => {
    let flatLev = false;
    let loopCount = 0;
    let loopBase = 5;
    let arr = [...array];
    const perGroup = Math.ceil(array.length / groupNum);

    // レベルがほぼ均一になるまでループ
    while (!flatLev) {
      loopCount++;
      if (loopCount % 50 === 0) {
        loopBase++;
      }

      let levSum = [];
      let newArr = [];
      for (let i = 0; i < array.length; i++) {
        const r = randomNum(arr);
        [arr[i], arr[r]] = [arr[r], arr[i]];
      }

      for (let i = 0; i < groupNum; i++) {
        const sortGroup = arr.slice(i * perGroup, (i + 1) * perGroup);
        newArr.push(sortGroup);
        console.log(newArr, loopCount, loopBase);

        const sum = newArr[i].reduce((a, b) => {
          return a + b.lev;
        }, 0);
        levSum.push(sum);
      }
      const range = Math.max.apply(null, levSum) - Math.min.apply(null, levSum);

      if (range < (loopBase * groupNum) / 2) {
        flatLev = true;
        return newArr;
      }
    }
  };

  // グループとリストの数を確認して発火
  if (groupNum && groupNum.match(/^[1-9]+$/)) {
    lists.length >= groupNum && groupNum > 1
      ? createTable(grouping(groupNum, lists))
      : alert(
        `${lists.length}件のリストを${groupNum}組に分けることはできません。`
      );
  } else {
    alert("【2以上の半角数字】を入力してください。");
  }
});
