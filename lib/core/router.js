const { _, log } = require('basd')

/**
 * Router for handling route-based actions.
 */
class Router {
  /**
   * Creates an instance of Router.
   * @param {Object} [opts={}] - The options for the router.
   * @param {string} [opts.routePrefix='on'] - The prefix for route handlers.
   * @param {Object} [opts.routes] - An object containing initial routes.
   * @param {string} [opts.pathPrefix] - A prefix to add to all route paths.
   */
  constructor(opts = {}) {
    _.objProp(this, 'routes', {})
    _.objProp(this, 'routePrefix', opts.routePrefix || 'on')
    if (opts.routes)
      this.addRoutes(opts.routes, opts.pathPrefix)
  }

  /**
   * Adds a single route and its handler to the router.
   * @param {string} route - The route path.
   * @param {Function} handler - The function to handle the route.
   */
  addRoute(route, handler) {
    _.set(this.routes, route, handler)
  }

  /**
   * Adds multiple routes from an object of methods.
   * @param {Object} obj - The object containing methods to be added as routes.
   * @param {string} [pathPrefix] - Optional prefix for the route paths.
   */
  addRoutes(obj, pathPrefix) {
    const methods = _.getMethods(obj)
    for (const name of methods) {
      if (!name.startsWith(this.routePrefix)) continue
      const handler = obj[name].bind(obj)
      const action = _.kebabCase(name.slice(this.routePrefix.length))
      const route = `${pathPrefix ? pathPrefix + '.' : ''}${action}`
      this.addRoute(route, handler)
    }
  }

  /**
   * Executes the handler associated with a given route.
   * @param {string} route - The route to execute.
   * @param {...*} args - Arguments to pass to the route handler.
   * @returns {Promise<*>} The result of the route handler execution.
   */
  async execute(route, ...args) {
    return _.invoke(this.routes, route, ...args)
  }
}

module.exports = Router
