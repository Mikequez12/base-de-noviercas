try {
  if (identify) {
    console.log(`Accepted ${identify}`);
    const bdd = {
      "Markel Rosco Matxain": {'DSR':"747821BV238AX"},
      "Ander Ímaz Ucedo": {'DSR':"218216BF109KA"},
      "Nekane Matxain Irastorza": {'DSR':"447269HS162WH"},
      "Vika Lesmes Gil": {'DSR':"154134AN225IL"}
    };
    window.bdd = bdd;
  } else {
    throw 'Identify is not defined correctly';
  };
} catch (error) {
  window.href = './404.html';
};
