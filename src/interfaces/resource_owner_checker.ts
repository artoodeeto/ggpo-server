export interface ResourceChecker {
  /**
   * This should be implemented to models that needs to validate a current user if they really own the resource
   *
   * @param {(number | string)} currentUserId Current User id, This can be extracted from req.payload
   * @param {(number | string)} requestParamsId Parameter ID from current resource that is to be requested
   * @returns {boolean} this should return a boolean if the current user really owns the resource
   * @memberof ResourceChecker
   */
  isOwnerOfResource(currentUserId: number, requestParamsId: number): boolean | Promise<boolean>;
}
