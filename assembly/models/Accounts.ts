import { context, u128 } from 'near-sdk-as';
import { ActiveAccounts, LockedAccounts } from '../constants';

@nearBindgen
export class Accounts {
  static deposit(owner: string, amount: u128): void {
    assert(
      u128.gt(amount, u128.fromU64(0)),
      'Invalid figure! Only figures above zero are accepted.'
    );
    const balance: u128 = Accounts.activeBalance(owner);
    ActiveAccounts.set(owner, u128.add(balance, amount));
  }

  static lock(benefactor: string, beneficiary: string, amount: u128): void {
    const key = benefactor + ':' + beneficiary;
    assert(
      u128.gt(amount, u128.fromU64(0)),
      'Invalid figure! Only figures above zero are accepted.'
    );
    const lBalance: u128 = Accounts.lockedBalance(benefactor, beneficiary);
    const aBalance: u128 = Accounts.activeBalance(benefactor);
    assert(
      u128.ge(aBalance, amount),
      'Insuficient funds! Top up and try again.'
    );
    LockedAccounts.set(key, u128.add(lBalance, amount));
    ActiveAccounts.set(benefactor, u128.sub(aBalance, amount));
  }

  static unlock(benefactor: string, beneficiary: string): void {
    const key = benefactor + ':' + beneficiary;
    const lBalance: u128 = Accounts.lockedBalance(benefactor, beneficiary);
    assert(
      u128.gt(lBalance, u128.fromU64(0)),
      'Insuficient funds to transact!'
    );
    const aBalance: u128 = Accounts.activeBalance(beneficiary);
    ActiveAccounts.set(beneficiary, u128.add(aBalance, lBalance));
    LockedAccounts.delete(key);
  }

  static transfer(benefactor: string, beneficiary: string): void {
    const key = benefactor + ':' + beneficiary;
    const lBalance: u128 = Accounts.lockedBalance(benefactor, beneficiary);
    assert(
      u128.gt(lBalance, u128.fromU64(0)),
      'Insuficient funds to transact!'
    );
    const aBalance: u128 = Accounts.activeBalance(benefactor);
    ActiveAccounts.set(benefactor, u128.add(aBalance, lBalance));
    LockedAccounts.delete(key);
  }

  static activeTransfer(sender: string, recipient: string, amount: u128): void {
    const senderBalance = Accounts.activeBalance(sender);
    assert(u128.ge(senderBalance, amount), 'Insufficient funds!');
    const recipientBalance = Accounts.activeBalance(recipient);
    const intendedSenderBalance = u128.sub(senderBalance, amount);
    const intendedRecipientBalance = u128.add(recipientBalance, amount);
    ActiveAccounts.set(sender, intendedSenderBalance);
    ActiveAccounts.set(recipient, intendedRecipientBalance);
  }

  static activeBalance(owner: string): u128 {
    return <u128>ActiveAccounts.get(owner, u128.fromU64(0));
  }

  static lockedBalance(benefactor: string, beneficiary: string): u128 {
    const key = benefactor + ':' + beneficiary;
    return <u128>LockedAccounts.get(key, u128.fromU64(0));
  }
}
