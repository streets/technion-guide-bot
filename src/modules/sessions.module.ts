/**
 * Used save an existing bot context for every user
 * The key is a fbid, value is a wit context object
 */
var sessions: Map<string, Object> = new Map();

export default sessions;
