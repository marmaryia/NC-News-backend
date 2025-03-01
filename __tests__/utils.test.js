const {
  convertTimestampToDate,
  mapDataForInsertion,
  createLookupObject,
  addIdProperty,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns current datestamp if no created_at property", () => {
    const mockCurrentDate = new Date("2020-01-01");
    jest.useFakeTimers().setSystemTime(mockCurrentDate);
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value", created_at: mockCurrentDate };
    expect(result).toEqual(expected);
  });
});

describe("mapDataForInsertion", () => {
  test("returns an empty array when an empty array is passed in", () => {
    expect(mapDataForInsertion([])).toEqual([]);
  });
  test("when passed in an array with a single nested object and a single key as a string, returns a nested array with the value at that key from the object", () => {
    const inputArr = [
      {
        description: "Code is love, code is life",
        slug: "coding",
        img_url: "",
      },
    ];
    expect(mapDataForInsertion(inputArr, "slug")).toEqual([["coding"]]);
  });
  test("when passed in an array with a single nested object and several keys as strings, returns a nested array with the values at those keys from the object", () => {
    const inputArr = [
      {
        description: "Code is love, code is life",
        slug: "coding",
        img_url: "",
      },
    ];
    expect(mapDataForInsertion(inputArr, "description", "slug")).toEqual([
      ["Code is love, code is life", "coding"],
    ]);
  });
  test("when passed in an array with a several nested objects and several keys as strings, returns an array with arrays of the values at those keys from the objects as ", () => {
    const inputArr = [
      {
        description: "Code is love, code is life",
        slug: "coding",
        img_url: "",
      },
      {
        description: "FOOTIE!",
        slug: "football",
        img_url:
          "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700",
      },
    ];
    expect(mapDataForInsertion(inputArr, "description", "slug")).toEqual([
      ["Code is love, code is life", "coding"],
      ["FOOTIE!", "football"],
    ]);
  });
  test("does not mutate the input array", () => {
    const inputArr = [
      {
        description: "Code is love, code is life",
        slug: "coding",
        img_url: "",
      },
    ];
    const inputArrAfter = [
      {
        description: "Code is love, code is life",
        slug: "coding",
        img_url: "",
      },
    ];
    mapDataForInsertion(inputArr);
    expect(inputArr).toEqual(inputArrAfter);
  });
  test("returns a new array", () => {
    const inputArr = [
      {
        description: "Code is love, code is life",
        slug: "coding",
        img_url: "",
      },
    ];
    const result = mapDataForInsertion(inputArr);
    expect(result).not.toBe(inputArr);
  });
});

describe("createLookupObject", () => {
  test("if given an empty array, returns an empty object", () => {
    expect(createLookupObject([])).toEqual({});
  });
  test("when given an array with a single nested object, converts it into an object where the key is the value of the first passed in key string and the value is the value of the second passed in key string", () => {
    const inputArr = [
      {
        article_id: 12,
        title: "Moustache",
      },
    ];
    const expectedResult = { Moustache: 12 };
    expect(createLookupObject(inputArr, "title", "article_id")).toEqual(
      expectedResult
    );
  });
  test("when given an array with several nested objects, converts it into an object where the keys are the values at the first passed in key string and the values are the values at the second passed in key string", () => {
    const inputArr = [
      {
        article_id: 12,
        title: "Moustache",
      },
      {
        article_id: 11,
        title: "Am I a cat?",
      },
    ];
    const expectedResult = { Moustache: 12, "Am I a cat?": 11 };
    expect(createLookupObject(inputArr, "title", "article_id")).toEqual(
      expectedResult
    );
  });
  test("does not mutate the input array", () => {
    const inputArr = [
      {
        article_id: 12,
        title: "Moustache",
      },
    ];
    const inputArrAfter = [
      {
        article_id: 12,
        title: "Moustache",
      },
    ];
    createLookupObject(inputArr, "title", "article_id");
    expect(inputArr).toEqual(inputArrAfter);
  });
});

describe("addIdProperty", () => {
  test("adds ID property from the provided lookup object when passed in an array with a single object", () => {
    const inputArr = [
      {
        slug: "coding",
        description: "Code is love, code is life",
      },
    ];
    const lookup = { coding: 1 };
    const expectedResult = [
      { slug: "coding", description: "Code is love, code is life", id: 1 },
    ];
    const result = addIdProperty(inputArr, lookup, "id", "slug");
    expect(result).toEqual(expectedResult);
  });
  test("adds ID properties from the provided lookup object to all objects in the passed in array", () => {
    const inputArr = [
      {
        slug: "coding",
        description: "Code is love, code is life",
      },
      {
        slug: "fun",
        description: "Whatever",
      },
    ];
    const lookup = { fun: 1, coding: 2 };
    const expectedResult = [
      { slug: "coding", description: "Code is love, code is life", id: 2 },
      { slug: "fun", description: "Whatever", id: 1 },
    ];
    const result = addIdProperty(inputArr, lookup, "id", "slug");
    expect(result).toEqual(expectedResult);
  });
  test("does not mutate input data", () => {
    const inputArr = [
      {
        slug: "coding",
        description: "Code is love, code is life",
      },
    ];
    const inputArrAfter = [
      {
        slug: "coding",
        description: "Code is love, code is life",
      },
    ];
    const lookup = { coding: 1 };
    const lookupAfter = { coding: 1 };

    addIdProperty(inputArr, lookup, "id", "slug");
    expect(inputArr).toEqual(inputArrAfter);
    expect(lookup).toEqual(lookupAfter);
  });
  test("returns a new array", () => {
    const inputArr = [
      {
        slug: "coding",
        description: "Code is love, code is life",
      },
    ];
    const lookup = { coding: 1 };
    const result = addIdProperty(inputArr, lookup, "id", "slug");
    expect(result).not.toBe(inputArr);
  });
});
