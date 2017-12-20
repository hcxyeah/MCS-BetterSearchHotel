function openSection(evt, name) {
		var i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
			//tablinks[i].classList.remove("active");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document.getElementById(name).style.display = "block";
		//evt.currentTarget.classList.add("active");
    	evt.currentTarget.className += " active";
	}

function selectTopic(topic) {
	d3.csv("data/" + topic)
	.get(function(data) {
	  generatePlot(data)
	});
}


function generatePlot(data) {

  var svg_width = 1200;
  var svg_height = 1200;
  var margin = {top: 50, right:  50, bottom: 30, left: 40};
  var height = svg_height - margin.top - margin.bottom;
  var width = svg_width - margin.left - margin.right;

	d3.selectAll("svg").remove();

  var svg = d3.select("#Topic")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_width);


  var g = svg.append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

  var stratify = d3.stratify()
      .parentId(function(d) {
        return d.id.substring(0, d.id.lastIndexOf("."));
      });

  var tree = d3.tree()
      .size([360, 500])
      .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      });

  var root = tree(stratify(data));

  var link = g.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", function(d) {
        return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
      })
		.attr("class", function (d) {
			topicid = d.id.concat(".").split(".")[1];
			return "link " + topicid;
		});




  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", function (d) {
			topicid = d.id.concat(".").split(".")[1]
      return "node" + (d.children ? " node--internal " + topicid : " node--leaf " + topicid); })
    .attr("transform", function(d) {
      return "translate(" + project(d.x, d.y) + ")"; });


  node.append("circle")
        .attr("r", 4)
				.on("mouseover", function(d) {
					if (d.id.split(".").length > 1) {
						topicid = d.id.split(".")[1];
						d3.selectAll(".link."+topicid).attr("style", "stroke:#f47396;stroke-opacity:1");
						d3.selectAll(".node." + topicid).attr("style", "fill:#f47396;opacity:1");
					}
				})
				.on("mouseout", function(d) {
					if (d.id.split(".").length > 1) {
						topicid = d.id.split(".")[1];
						d3.selectAll(".link."+topicid).attr("style", "stroke:#7b6888;stroke-opacity:0.4");
						d3.selectAll(".node." + topicid).attr("style", "fill:#7b6888;opacity:0.7");
					}
				});


  node.append("text")
        .attr("dy", ".31em")
        .attr("x", function(d) {
          return d.x < 180 === !d.children ? 6 : -6; })
        .style("text-anchor", function(d) {
          return d.x < 180 === !d.children ? "start" : "end"; })
        .attr("transform", function(d) {
          return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
        .text(function(d) {
          return d.id.substring(d.id.lastIndexOf(".") + 1); })
					.on("mouseover", function(d) {
						if (d.id.split(".").length > 1) {
							topicid = d.id.split(".")[1];
							console.log(topicid);
							d3.selectAll(".link."+topicid).attr("style", "stroke:#f47396;stroke-opacity:1");
							d3.selectAll(".node." + topicid).attr("style", "fill:#f47396;opacity:1");
						}
					})
					.on("mouseout", function(d) {
						if (d.id.split(".").length > 1) {
							topicid = d.id.split(".")[1];
							d3.selectAll(".link."+topicid).attr("style", "stroke:#7b6888;stroke-opacity:0.4");
							d3.selectAll(".node." + topicid).attr("style", "fill:#7b6888;opacity:0.7");
						}
					});

	link.on("mouseover", function(d) {
		if (d.id.split(".").length > 1) {
			topicid = d.id.split(".")[1];
			console.log(topicid);
			d3.selectAll(".link."+topicid).attr("style", "stroke:#f47396;stroke-opacity:1");
			d3.selectAll(".node." + topicid).attr("style", "fill:#f47396;opacity:1");
		}
	})
	.on("mouseout", function(d) {
		if (d.id.split(".").length > 1) {
			topicid = d.id.split(".")[1];
			d3.selectAll(".link."+topicid).attr("style", "stroke:#7b6888;stroke-opacity:0.4");
			d3.selectAll(".node." + topicid).attr("style", "fill:#7b6888;opacity:0.7");
		}
	});

}


function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function selectTag(evt) {
		var i, tags;

		// Get all elements with class="tablinks" and remove the class "active"
		tags = document.getElementsByClassName("tag");
		for (i = 0; i < tags.length; i++) {
            tags[i].className = tags[i].className.replace(" selected", "");
			//tablinks[i].classList.remove("active");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		//document.getElementById(name).style.display = "block";
		//evt.currentTarget.classList.add("active");
    	evt.currentTarget.className += " selected";
	}

$(document).ready(function () {

  $.ajax({
      url: "data/keywordToListId.csv",
      dataType: "text",
      success: function (file) {
          var tagData = $.csv.toArrays(file).slice(1);
          var tagGroup = "";
          $.each(tagData, function (i, val) {
              tagGroup += '<button type="button" class="tag btn btn-info" id="tag' + i + '" value="' + val[0] + '">' + val[0] + '</button>';
          });
          $("#tagGroup").empty().append(tagGroup);
          $.ajax({
              url: "data/listingToSentiment.csv",
              dataType: "text",
              success: function (file) {
                  var tableData = $.csv.toArrays(file);
                  var header = tableData[0];
                  var body = tableData.slice(1);

									var indexName = header.indexOf("name");
									var indexListingUrl = header.indexOf("listing_url");
									header.splice(indexListingUrl, 1);

									for (var i = 0; i < body.length; i++) {
											var name = body[i][indexName];
											var listingUrl = body[i][indexListingUrl];
											body[i][indexName] = '<a href="' + listingUrl + '" target="blank">' + name + '</a>';
											body[i].splice(indexListingUrl, 1);
									}

									var indexHostImgUrl = header.indexOf("host_thumbnail_url");
									var indexImgUrl = header.indexOf("photo");
									header[indexImgUrl] = "photo";
									header[indexHostImgUrl] = "host_thumbnail";

                  generateTable(header, body);
									selectTopic("topics.csv");

                  $('.tag').on('click', function (event) {
                      var index = tagData[this.id.slice(3)][1].slice(1, -1).split(", ");
                      var newBody = [];
                      for (var i = 0; i < index.length; i++) {
                          newBody.push(body[index[i]]);
                      }
											selectTag(event);
                      generateTable(header, newBody);
											selectTopic("topicForKeyword/" + this.value + ".csv");
                  });
              }
          });
      }
  });



  function generateTable(header, body) {
			var indexHostImgUrl = header.indexOf("host_thumbnail");
			var indexImgUrl = header.indexOf("photo");
			var indexName = header.indexOf("name");
			var indexSpace = header.indexOf("description");
			var indexTransit = header.indexOf("transit");
			var indexHostAbout = header.indexOf("host_about");

      var tableHeaders = "";
      $.each(header, function (i, val) {
          tableHeaders += "<th>" + val + "</th>";
      });

      $("#tableContainer").empty().append('<table id="table" class="table table-bordered table-striped"><thead><tr>' + tableHeaders + '</tr></thead>');
      var table = $("#table").DataTable({
          data: body,
          //autoWidth: false,
          //autoHeight: false,
          scrollY: '70vh',
          scrollX: true,
					scrollCollapse: true,
					columnDefs: [
							{"width": "100px", "targets": indexName},
							{
									"width": "200px",
									"targets": indexImgUrl,
									"data": "img",
									"render": function (url, type, full) {
											return '<img src="' + full[indexImgUrl] + '"/>';
									}
							},
							{"width": "400px", "targets": indexSpace},
							{"width": "300px", "targets": indexTransit},
							{"width": "300px", "targets": indexHostAbout},
							{
									"width": "200px",
									"targets": indexHostImgUrl,
									"data": "img",
									"render": function (url, type, full) {
											return '<img src="' + full[indexHostImgUrl] + '"/>';
									}
							}
					]
      });

      // table.columns(header.indexOf("space")).search("locate").draw();
  }
});
