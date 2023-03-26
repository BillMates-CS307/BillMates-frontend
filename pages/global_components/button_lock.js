//very simple synchronized locking
export const ButtonLock = {
  lockValue: false,
  isLocked() {
    return this.lockValue;
  },
  LockButton() {
    this.lockValue = true;
  },
  UnlockButton() {
    this.lockValue = false;
  }
};


export default function ButtonLockPage() {
  return <></>;
}