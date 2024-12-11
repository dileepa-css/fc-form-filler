chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillCompanionData") {
    fillCompanionData();
    sendResponse({ success: true });
  }

  if (request.action === "fillCreditCardData") {
    fillCreditCardData();
    sendResponse({ success: true });
  }

  return true; // Allows asynchronous response
});

function fillFormField(value, delay = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = new InputEvent("input", { bubbles: true });
      const changeEvent = new Event("change", { bubbles: true });

      if (typeof value === "function") {
        value();
      } else if (typeof value === "string") {
        const element = document.activeElement;
        // console.log("element", element);

        if (
          (!!element && element.tagName === "INPUT") ||
          element.tagName === "SELECT"
        ) {
          // console.log(element.tagName);

          element.value = value;
          element.dispatchEvent(event);
          element.dispatchEvent(changeEvent);
        }
      }
      resolve();
    }, delay);
  });
}
async function fillCompanionData() {
  const kanjiNamePool = "佐藤鈴木高橋田中渡辺伊藤山本中村小林加藤吉田".split(
    ""
  );

  /*
  アイウエオ
  カキクケコ
  サシスセソ
  タチツテト
  シャ　シュ　ショ
  */
  const kanaNamePool =
    "サトウスズキタカハシタナカワタナベイトウヤマモトナカムラコバヤシカトウヨシダ".split(
      ""
    );
  const prefectures = [
    "東京都",
    "大阪府",
    "神奈川県",
    "埼玉県",
    "千葉県",
    "愛知県",
  ];
  const municipalities = ["渋谷区", "新宿区", "中央区", "港区", "品川区"];
  const streets = ["神宮前", "表参道", "青山", "恵比寿", "代々木"];

  function generateRandomString(characters, length) {
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
  }

  function generateRandomDate() {
    const year = Math.floor(Math.random() * (2005 - 1950) + 1950);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    return { year, month, day };
  }

  async function fillForm() {
    try {
      // console.log('Starting form fill...');

      // Generate data
      const lastName = generateRandomString(kanjiNamePool, 2);
      const firstName = generateRandomString(kanjiNamePool, 2);
      const lastNameKana = generateRandomString(kanaNamePool, 3);
      const firstNameKana = generateRandomString(kanaNamePool, 3);
      const { month, day } = generateRandomDate();

      const kanjiNameInputs = Array.from(document.querySelectorAll("label"))
        .find((label) => label.textContent === "氏名 * ")
        .nextElementSibling.querySelectorAll("input");
      const firstNameKanjiInput = kanjiNameInputs[0];
      const lastNameKanjiInput = kanjiNameInputs[1];

      const kanaNameInputs = Array.from(document.querySelectorAll("label"))
        .find((label) => label.textContent === "氏名カナ * ")
        .nextElementSibling.querySelectorAll("input");
      const firstNameKanaInput = kanaNameInputs[0];
      const lastNameKanaInput = kanaNameInputs[1];

      const birthdayInputs = Array.from(document.querySelectorAll("label"))
        .find((label) => label.textContent === "生年月日 * ")
        .nextElementSibling.querySelectorAll("select");
      // const yearInput = birthdayInputs[0];
      const monthInput = birthdayInputs[1];
      const dayInput = birthdayInputs[2];

      // console.log("yearInput", year);

      // Map for all form fields with their values
      const formFields = [
        {
          value: firstName,
          selector: {
            query: 'input[value="FirstName"]',
            node: firstNameKanjiInput,
          },
        },
        {
          value: lastName,
          selector: {
            query: 'input[value="LastName"]',
            node: lastNameKanjiInput,
          },
        },
        {
          value: firstNameKana,
          selector: {
            query: 'input[value="MEMBER_FIRST_NM_KANA"]',
            node: firstNameKanaInput,
          },
        },
        {
          value: lastNameKana,
          selector: {
            query: 'input[value="MEMBER_LAST_NM_KANA"]',
            node: lastNameKanaInput,
          },
        },
        // { value: 2001, selector: {node: yearInput }},
        { value: month, selector: { node: monthInput } },
        { value: day, selector: { node: dayInput } },
        {
          value: "1500001",
          selector: { query: 'input[placeholder="1000000"]' },
        }, // Post code
        //   { value: '東京都', selector: {query:'select.form_control' }}, // Prefecture
        //   { value: '渋谷区', selector: {query:'input[value="ADDRESS_CITY"]' }},
        //   { value: '神宮前1-1-1', selector: {query:'input[value="ADDRESS_STREET"]' }},
        //   { value: '123', selector: {query:'input[value="ADDRESS_BUILDING"]' }},
        {
          value: "09012345678",
          selector: { query: 'input[placeholder="09000000000"]' },
        },
        {
          value: "dileepa-css@yopmail.com",
          selector: { query: 'input[type="email"]' },
        },
      ];

      // Function to focus and fill a field
      const focusAndFill = async (selector, value) => {
        const element = !!selector.node
          ? selector.node
          : document.querySelector(selector.query);
        if (element) {
          // console.log(element);

          element.focus();
          await fillFormField(value, 50);
          // element.value = value;
        } else {
          console.error(
            selector,
            `Element not found for selector: ${selector}`
          );
        }
      };

      // Fill each field with a small delay between them
      for (const field of formFields) {
        await focusAndFill(field.selector, field.value);
      }

      // Handle birth date separately
      // const yearSelect = document.querySelector('select[name*="year"]');
      // const monthSelect = document.querySelector('select[name*="month"]');
      // const daySelect = document.querySelector('select[name*="day"]');

      // if (yearSelect) yearSelect.value = '1988';
      // if (monthSelect) monthSelect.value = '08';
      // if (daySelect) daySelect.value = '18';

      // Handle sex selection
      const sexSelect = document.querySelector("select.form_control");
      if (sexSelect) {
        sexSelect.value = "男性";
        sexSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }

      console.log("Form fill completed!");
    } catch (error) {
      console.error("Error filling form:", error);
    }
  }

  await fillForm();

  // Handle birth date year separately !!
  const { year } = generateRandomDate();
  Array.from(document.querySelectorAll("label"))
    .find((label) => label.textContent === "生年月日 * ")
    .nextElementSibling.querySelectorAll("select")[0]
    .focus();
  const el = document.activeElement;
  el.value = year;
  el.dispatchEvent(new Event("change", { bubbles: true }));
  // console.log("Active",document.activeElement);

  await fillFormField(year, 0);
}

async function fillCreditCardData() {
  try {
    const creditCardNumber = Array.from(
      document.querySelectorAll("label")
    ).find((label) => label.innerText === "カード番号").nextElementSibling;

    const cardHolderName = Array.from(document.querySelectorAll("label")).find(
      (label) => label.innerText === "名義人"
    ).nextElementSibling;

    const securityCode = Array.from(document.querySelectorAll("label")).find(
      (label) => label.innerText === "セキュリ\nティコード"
    ).nextElementSibling;

    const validPeriod = Array.from(document.querySelectorAll("label"))
      .find((label) => label.innerText === "有効期限")
      .parentElement.querySelectorAll("select");

    const month = validPeriod[0];
    const year = validPeriod[1];

    const formFields = [
      {
        value: "4242424242424242",
        selector: {
          node: creditCardNumber,
        },
      },
      {
        value: "CSS Tester",
        selector: {
          node: cardHolderName,
        },
      },
      {
        value: "7",
        selector: {
          node: month,
        },
      },
      {
        value: String(new Date().getFullYear() + 3).slice(-2),
        selector: {
          node: year,
        },
      },
      {
        value: "1234",
        selector: {
          node: securityCode,
        },
      },
    ];

    const focusAndFill = async (selector, value) => {
      const element = !!selector.node
        ? selector.node
        : document.querySelector(selector.query);
      if (element) {
        // console.log(element);

        element.focus();
        await fillFormField(value, 50);
        // element.value = value;
      } else {
        console.error(selector, `Element not found for selector: ${selector}`);
      }
    };

    // Fill each field with a small delay between them
    for (const field of formFields) {
      await focusAndFill(field.selector, field.value);
    }
  } catch (error) {
    console.error("Could not fill credit card details :", error);
  }
}
