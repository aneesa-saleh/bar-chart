var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var
BarChartContainer = function (_React$Component) {_inherits(BarChartContainer, _React$Component);
  function BarChartContainer(props) {_classCallCheck(this, BarChartContainer);var _this = _possibleConstructorReturn(this, (BarChartContainer.__proto__ || Object.getPrototypeOf(BarChartContainer)).call(this,
    props));
    _this.state = { gdpData: {} };return _this;
  }_createClass(BarChartContainer, [{ key: "componentDidMount", value: function componentDidMount()

    {var _this2 = this;
      var request = function request(obj) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", obj.url);
          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300)
            resolve(xhr.response);else

            reject(xhr.statusText);
          };
          xhr.onerror = function () {return reject(xhr.statusText);};
          xhr.send(obj.body);
        });
      };

      var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
      request({ url: url }).
      then(function (data) {
        var gdpData = JSON.parse(data);
        _this2.setState({ gdpData: gdpData });
      });
    } }, { key: "render", value: function render()

    {
      return (
        React.createElement("div", null,
          React.createElement(BarChart, { gdpData: this.state.gdpData })));

    } }]);return BarChartContainer;}(React.Component);var


BarChart = function (_React$Component2) {_inherits(BarChart, _React$Component2);
  function BarChart(props) {_classCallCheck(this, BarChart);return _possibleConstructorReturn(this, (BarChart.__proto__ || Object.getPrototypeOf(BarChart)).call(this,
    props));
  }_createClass(BarChart, [{ key: "componentDidUpdate", value: function componentDidUpdate()
    {
      var months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      var margin = {
        top: 20,
        bottom: 45,
        left: 60,
        right: 20 };

      var w = 940,h = 450,width = w - margin.left - margin.right,height = h - margin.top - margin.bottom;
      var gdpArr = this.props.gdpData.data.map(function (d) {
        return { date: new Date(d[0]), gdp: d[1] };
      });
      var length = gdpArr.length;
      var colorScale = d3.scaleLinear().domain([0, length]).range(['#327d87', '#79b7b3']);
      var svg = d3.select(".svgContainer").append("svg").
      attr("id", "chart").
      attr("width", w).
      attr("height", h);

      var chart = svg.append("g").
      attr("width", width).
      attr("height", height).
      classed("inner-chart", true).
      attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      if (this.props.gdpData.id) {

        var x = d3.scaleBand().rangeRound([0, width], 0).padding(0).
        domain(gdpArr.map(function (d) {return d.date;}));
        var y = d3.scaleLinear().range([height, 0]).
        domain(d3.extent(gdpArr, function (d) {return d.gdp;}));
        var yValueScale = d3.scaleLinear().range([d3.min(gdpArr, function (d) {return d.gdp;}) + 300, d3.max(gdpArr, function (d) {return d.gdp;})]).
        domain(d3.extent(gdpArr, function (d) {return d.gdp;}));
        var xAxis = d3.axisBottom().
        scale(x).
        tickFormat(d3.timeFormat("%Y")).
        tickValues(x.domain().filter(function (d, i) {return !(i % 21);}));

        var yAxis = d3.axisLeft().
        scale(y);
        //.ticks(10);
        var tip = d3.tip().
        attr("class", "d3-tip").
        offset([0, 0]).
        html(function (d) {
          var gdp = "$" + d.gdp.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " Billion";
          var date = d.date.getFullYear() + " - " + months[d.date.getMonth()];
          return "<span class=\"gdp\"><strong>" + gdp + "</strong></span><br/> <span class=\"date\">" + date + "</span>";
        });

        chart.append("g").
        classed("x axis", true).
        attr("transform", "translate(0," + height + ")").
        call(xAxis);

        chart.append("g").
        classed("y axis", true).
        call(yAxis);

        chart.selectAll(".bar").
        data(gdpArr).
        enter().
        append("rect").
        classed("bar", true);

        chart.selectAll(".bar").
        attr("x", function (d) {return x(d.date);}).
        attr("y", function (d) {return y(yValueScale(d.gdp));}).
        attr("height", function (d) {return height - y(yValueScale(d.gdp));}).
        attr("width", function (d) {return x.bandwidth();}).
        style("fill", function (d, i) {return colorScale(i);}).
        on("mouseover", tip.show).
        on("mouseout", tip.hide);

        chart.selectAll(".bar").
        data(gdpArr).
        exit().
        remove();

        chart.select(".y.axis").
        append("text").
        classed("axis-label", true).
        attr("x", 0).
        attr("y", 0).
        attr("transform", "translate(17,0) rotate(-90)").
        text("GDP").
        style("fill", "black");

        svg.call(tip);
      }
    } }, { key: "render", value: function render()
    {
      var description = "" + this.props.gdpData.description;
      return (
        React.createElement("div", null,
          React.createElement("h2", { className: "heading" }, "Gross Domestic Product, USA"),
          React.createElement("div", { className: "svgContainer" }),
          React.createElement("div", { className: "descriptionWrapper" },
            React.createElement("p", { className: "description" }, description),
            React.createElement("p", { className: "description" }, "Source: " + this.props.gdpData.source_name))));


    } }]);return BarChart;}(React.Component);


ReactDOM.render(React.createElement(BarChartContainer, null), document.querySelector("#root"));