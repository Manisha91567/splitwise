const { VirtualType } = require('mongoose');
const Expenses = require('../models/Expenses');
const Member = require('../models/Members');
const Settle = require('../models/Settle');

async function addExpenses(data, id) {

  try {
    //user id must be in memberIds
    const value = await Member.find({ createdBy: id });
    const uId = value.map(p => { return p._id });
    uId.forEach(item => {
      if (!data.memberIds.includes(item)) {
        return { message: "User Id must be included in memberIds" };
      }
    });


    //validation for paidBy
    const resultOfPaidById = data.paidBy.map(p => { return p.paidById });
    const value1 = resultOfPaidById.every(item => {
      if (data.memberIds.includes(item)) {
        return item;
      }
    });
    if (value1 == false) {
      return { message: "Please add paidById which are mentioned in memberId" };
    }

    //validation for splitWith
    const resultOfSplitWithId = data.splitWith.map(p => { return p.splitWithId });

    const value2 = resultOfSplitWithId.every(item => {
      if (data.memberIds.includes(item)) {
        return item;
      }
    });
    if (value2 == false) {
      return { message: "Please add splitWithId which are mentioned in memberId" };
    }

    //expense within group
    if (data.groupId != undefined) {
      const members = await Member.find({ _id: { $in: data.memberIds }, groupId: data.groupId });
      if (members.length != data.memberIds.length) {
        return { message: "Please add members from same group" };
      }
    }



    //amount validation 
    if (data.paidBy.length == 1) {
      if (data.amount != data.paidBy.map(p => { return p.paidByAmount })) {
        return { message: "The paidByAmount is different than total paid amount" }
      }
    } else {
      var sum = 0;
      const value = data.paidBy.map(p => { return p.paidByAmount });
      value.forEach(item => { return sum = sum + item });
      if (data.amount != sum) {
        return { message: "Total of everyone's share is different than total paid amount" }
      }
    }

    //split equally validation
    if (data.split == 'equally') {
      var sum = 0;
      const value = data.splitWith.map(p => { return p.splitWithAmount });
      value.forEach(item => { return sum = sum + item });
      const allEqual = arr => arr.every(val => val === arr[0]);

      if (sum != data.amount && !allEqual(value)) {
        return { message: "SplitWithAmount should be same for every member and their sum should be equal to split amount" };
      }
    }

    //split unequally : by exact amount
    if (data.split == 'unequally' && data.splitMethod == 'byExactAmount') {
      var sum = 0;
      const value = data.splitWith.map(p => { return p.splitWithAmount });
      value.forEach(item => { return sum = sum + item });
      if (data.amount != sum) {
        return { message: "Total of everyone's amount is different than total amount" }
      }
    }

    //split unequally : by percentage
    if (data.split == 'unequally' && data.splitMethod == 'byPercentage') {
      var sum = 0;
      const value = data.splitWith.map(p => { return p.splitWithAmount });
      value.forEach(item => { return sum = sum + item });
      if (sum != 100) {
        return { message: "Total of everyone's share is different than total amount" }
      }

    }

    const result = await Expenses.create({
      memberIds: data.memberIds,
      description: data.description,
      amount: data.amount,
      paidBy: data.paidBy,
      split: data.split,
      splitMethod: data.splitMethod,
      splitWith: data.splitWith,
      groupId: data.groupId
    });
    return { success: true, message: "Expense is created!", body: result };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

async function getAllExpenses(id) {
  try {

    const value = await Member.find({ createdBy: id });
    const uId = value.map(p => { return (p._id).toString() });

    //expenses
    const resultExpense = await Expenses.find({}, 
      { "paidBy": { $elemMatch: { "paidById": { $in: uId } } },
       "splitWith": { $elemMatch: { "splitWithId": { $in: uId } } },
        "createdAt": 1, "description": 1 }
        ).populate('paidBy.paidById', 'name')
        .populate('splitWith.splitWithId', 'name'); 

    const expenses = resultExpense.map(p => {
      const paidAmount = p.paidBy.map(p => p.paidByAmount);
      const splitAmount = p.splitWith.map(p => p.splitWithAmount);
      const amount = paidAmount - splitAmount;

      const paidName = p.paidBy.map(p => p.paidById.name).toString();
     
     

      if (amount > 0) {
        return {
          date: p.createdAt, description: p.description, detailsPaid: { message: "you paid", amount: paidAmount },
          detailsSplit: { message: "you lent " , amount: amount }
        };

      } else if (paidAmount == 0) {
        return {
          date: p.createdAt, description: p.description, detailsPaid: { message: paidName +" paid", amount: paidAmount },
          detailsSplit: { message: paidName + " lent you", amount: amount }
        };
      } else {
        return {
          date: p.createdAt, description: p.description, detailsPaid: { message: "you paid", amount: paidAmount },
          detailsSplit: { message: "you borrowed", amount: amount }
        };
      }
    });

    //settle
    const resultSettle = await Settle.find({}).populate('payerId', 'name').populate('recipientId', 'name');
    const settle = resultSettle.map(p => {

      if (uId.includes((p.payerId._id).toString())) {
        return {
          date: p.createdAt, Text: p.payerId.name + " paid " + p.recipientId.name + " $" + p.settleAmount,
          message: "you paid", amount: p.settleAmount
        };
      } else if (uId.includes((p.recipientId._id).toString())) {
        return {
          date: p.createdAt, Text: p.payerId.name + " paid " + p.recipientId.name + " $" + p.settleAmount,
          message: "you received", amount: p.settleAmount
        };
      } else {
        return {
          date: p.createdAt, Text: p.payerId.name + " paid " + p.recipientId.name + " $" + p.settleAmount,
          message: "not involved"
        };
      };
    })

    const result = expenses.concat(settle);
    result.sort((a, b) => { return b.date - a.date });

    return { success: true, body: result };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};


async function getTotalBalance(id) {
  try {
    //Total user paid
    const value = await Member.find({ createdBy: id });
    const uId = value.map(p => { return p._id });

    const resultPaidBy = await Expenses.find({}, { "paidBy": { $elemMatch: { "paidById": { $in: uId } } } });
    const resultPaidAmount = resultPaidBy.map(p => { return p.paidBy.map(p => { return p.paidByAmount }) }).flat(1);
    var totalYouPaid = 0;
    resultPaidAmount.forEach(item => { return totalYouPaid += item });


    //User total share
    const resultSplitWith = await Expenses.find({ $or: [{ "split": "equally" }, { "splitMethod": "byExactAmount" }] }, { "splitWith": { $elemMatch: { "splitWithId": { $in: uId } } } });
    const resultSplitAmount = resultSplitWith.map(p => { return p.splitWith.map(p => { return p.splitWithAmount }) }).flat(1);
    var normalAmount = 0;
    resultSplitAmount.forEach(item => { return normalAmount += item });

    const resultPercentage = await Expenses.find({ "splitMethod": "byPercentage" }, { "splitWith": { $elemMatch: { "splitWithId": { $in: uId } } }, "amount": 1 });
    const resultSplitPercentage = resultPercentage.map(p => { return p.splitWith.map(p => { return p.splitWithAmount }) }).flat(1);
    const amount = resultPercentage.map(p => { return p.amount });
    const percentageAmount = (amount * resultSplitPercentage) / 100;

    const totalShare = normalAmount + percentageAmount;



    //payments made
    const resultSettleMade = await Settle.find({ "payerId": { $in: uId } });
    const finalPaymentMade = resultSettleMade.map(p => { return p.settleAmount });
    var paymentMade = 0;
    finalPaymentMade.forEach(item => { return paymentMade += item });

    //payments received
    const resultSettleRec = await Settle.find({ "recipientId": { $in: uId } });
    const finalPaymentRec = resultSettleRec.map(p => { return p.settleAmount });
    var paymentReceived = 0;
    finalPaymentRec.forEach(item => { return paymentReceived += item });


    //Total change in balance or User total balance
    const totalBalance = (totalYouPaid + paymentMade) - (totalShare + paymentReceived);
    if (totalBalance >= 1) {
      return {
        totalYouPaidFor: totalYouPaid,
        yourTotalShare: totalShare,
        paymentsMade: paymentMade,
        paymentReceived: paymentReceived,
        message: "you are owed", amount: totalBalance
      };
    } else if (totalBalance < 0) {
      return {
        totalYouPaidFor: totalYouPaid,
        yourTotalShare: totalShare,
        paymentsMade: paymentMade,
        paymentReceived: paymentReceived,
        message: "you owe", amount: totalBalance
      };
    } else {
      return {
        totalYouPaidFor: totalYouPaid,
        yourTotalShare: totalShare,
        paymentsMade: paymentMade,
        paymentReceived: paymentReceived,
        message: "You are all settled up", amount: totalBalance
      };
    }
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
}
module.exports = { addExpenses, getAllExpenses, getTotalBalance };