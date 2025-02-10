(function () {
  const inputField = document.getElementById("inputField");
  const showValueElement = document.getElementById("showSpan");
  let showValue = "";
  let originValue = "";

  function findNonAsteriskIndexes(str) {
    // 使用正则表达式匹配所有非 `*` 字符
    const matches = [...str.matchAll(/[^●]/g)];

    // 返回所有非 `*` 字符的索引
    return matches.map((match) => {
      /*
        value: 需要替换的值
        index: 替换的索引位置
        */
      return {
        value: match[0],
        index: match.index,
      };
    });
  }

  function addStrByIndexListValue(str, indexValueList) {
    indexValueList.forEach((item) => {
      const { value, index } = item;
      str = str.slice(0, index) + value + str.slice(index);
    });
    return str;
  }

  function changeStrByIndexListValue(str, indexValueList) {
    let strList = str.split("");
    indexValueList.forEach((item) => {
      const { value, index } = item;
      strList[index] = value;
    });
    return strList.join("");
  }

  function deleteStrByStartAndIndex(str, startPosition, deleteLength) {
    return (
      str.slice(0, startPosition) + str.slice(startPosition + deleteLength)
    );
  }

  function deleteStrByCurValue(curValue, originValue, remainIndexList) {
    let curValueList = curValue.split("");
    let originValueList = originValue.split("");
    let remainIndexListIndex = remainIndexList.map((r) => r.index);
    // 左起正取
    let minIndex = Math.min(...remainIndexListIndex);
    // 右起倒取
    let maxIndex = Math.max(...remainIndexListIndex);
    curValueList.forEach((cur, index) => {
      const findItem = remainIndexList.find((item) => item.index == index);
      if (!findItem) {
        if (index < minIndex) {
          curValueList[index] = originValueList[index];
          return;
        }
        if (index > maxIndex) {
          let countBackIndex = curValueList.length - index;
          curValueList[index] =
            originValueList[originValue.length - countBackIndex];
        }
      }
    });
    return curValueList.join("");
  }

  inputField.addEventListener("change", (e) => {
    const curValue = e.target.value;
    // 记录光标的开始位置为删除用
    let startPosition = e.target.selectionStart;
    if (curValue.trim() == "") {
      originValue = "";
      showValue = "";
      originspan.textContent = originValue;
      showValueElement.textContent = showValue;
      inputField.value = showValue;
      return;
    } else {
      // 处理值的情况
      let originValueLength = originValue.length;
      let curValueLength = curValue.length;
      // 代表值可能是增加、修改、删除, 大于0代表增加, 小于0代表减少, 等于0代表值发生改变
      let isAdd = curValue.length > originValueLength;
      let isChange = curValue.length == originValue.length;
      let differentNum = curValue.length - originValue.length;
      if (isAdd) {
        const effectIndexList = findNonAsteriskIndexes(curValue);
        originValue = addStrByIndexListValue(originValue, effectIndexList);
      } else if (isChange) {
        const changeIndexList = findNonAsteriskIndexes(curValue);
        originValue = changeStrByIndexListValue(originValue, changeIndexList);
      } else {
        // 删除的情况
        const remainIndexList = findNonAsteriskIndexes(curValue);
        // 替换删除, 例如: 123456 用户选中2345替换为8  186
        if (Array.isArray(remainIndexList) && remainIndexList.length > 0) {
          originValue = deleteStrByCurValue(
            curValue,
            originValue,
            remainIndexList
          );
        } else {
          // 删除键删除
          // 把删除的个数转为正数, 方便删除使用
          let deleteLength = Math.abs(differentNum);
          originValue = deleteStrByStartAndIndex(
            originValue,
            startPosition,
            deleteLength
          );
        }
      }
    }
    // 处理完之后赋值
    originspan.textContent = originValue;
    showValueElement.textContent = "●".repeat(curValue.length);
    inputField.value = "●".repeat(curValue.length);
  });
})();
