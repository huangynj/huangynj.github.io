$(document).on('click','.navbar-collapse.in',function(e) {
               if( $(e.target).is('a') ) {
               $(this).collapse('hide');
               }
               });

$(function () {
  $('#bs-example-navbar-collapse-1').on('shown.bs.collapse', function(e) {
                                        $('#my_dropdown').dropdown('toggle', 'open').hide();
                                        console.log('shown:', e);
                                        });
  });


function spiderjam(mym, myd){
    document.write("<a href=mailto:"	+ mym + "&#64;" + myd + ">" + mym + "&#64;" + myd + "</a>");
}

function firefox() {
    var browser=navigator.userAgent.toLowerCase();
    if(browser.indexOf('firefox') > -1) {
        $('#bs-example-navbar-collapse-2').toggle();
    }
}

function reset_menus() {
    sizing($(window).width());
}

// Take action if the request on URI has internal link '#'
function internal_link() {
    var urlArray = window.location.href.split('#');
    if (urlArray.length == 2 && urlArray[1] != "") {
        switch (urlArray[1]) {
            case "intro":        $('#tab-1-content').show(); break;
            case "news":         $('#tab-2-content').show(); break;
            case "publications": $('#tab-3-content').show(); break;
            case "courses":      $('#tab-4-content').show(); break;
            case "awards":       $('#tab-5-content').show(); break;
            case "service":      $('#tab-6-content').show(); break;
            case "research":     $('#tab-7-content').show(); break;
            case "contact":      $('#tab-9-content').show(); break;
            default: break;
        }
    }
}

function sizing(windowWidth) {
    //alert(windowWidth);
    if(windowWidth < 1024){ // desktop size
        $('.twittertop').hide();
        $('.twitterlow').show();
    } else {
        $('.twittertop').show();
        $('.twitterlow').hide();
    }

    if(windowWidth <= 480){ // ipad:768, Nexus10:800, 480
        $('.allshow').hide(); //
        $('.noshow').show();
        $('.expandshow').show();
        $('.collapseshow').hide();
    } else {
        $('.allshow').show();
        $('.noshow').hide();
        $('.expandshow').hide();
        $('.collapseshow').hide();
    }
}

jQuery(document).ready(function($) {
                       var windowWidth = $(window).width();
                       $(window).resize(function(){
                                        // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
                                        if ($(window).width() != windowWidth) {
                                        windowWidth = $(window).width();
                                        sizing(windowWidth);
                                        }
                                        });
                       sizing(windowWidth);
                       internal_link();
                       });


// Google Site Search | Search box
(function() {
 var cx = '012777421281883581498:r3xp4rmwevw';
 var gcse = document.createElement('script');
 gcse.type = 'text/javascript';
 gcse.async = true;
 gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
 '//cse.google.com/cse.js?cx=' + cx;
 var s = document.getElementsByTagName('script')[0];
 s.parentNode.insertBefore(gcse, s);
 })();

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-70658068-1', 'auto');
ga('send', 'pageview');

// Add reverse-tabnabbing protection to static and third-party injected links.
(function() {
    function protectBlankLinks() {
        $('a[target="_blank"]').each(function() {
            var rel = ($(this).attr('rel') || '').split(/\s+/).filter(Boolean);
            if (rel.indexOf('noopener') === -1) rel.push('noopener');
            if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
            $(this).attr('rel', rel.join(' '));
        });
    }

    $(document).ready(function() {
        var pending = false;

        protectBlankLinks();

        if (!window.MutationObserver) return;

        new MutationObserver(function() {
            if (pending) return;
            pending = true;
            setTimeout(function() {
                pending = false;
                protectBlankLinks();
            }, 0);
        }).observe(document.body, { childList: true, subtree: true });
    });
})();

// ==========================================================================
// LIVE PUBLICATION FILTER
// ==========================================================================
$(document).ready(function() {
    $('#pub-search-input').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        // Filter the academic-list items
        $('.academic-list li').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        
        // Add a focus style to the input container
        if (value.length > 0) {
            $(this).css('box-shadow', '0 4px 15px rgba(0, 0, 0, 0.1)');
        } else {
            $(this).css('box-shadow', '0 2px 10px rgba(0, 0, 0, 0.05)');
        }
    });
});

// ==========================================================================
// 1-CLICK COPY CITATION
// ==========================================================================
$(document).ready(function() {
    // Select only list items in the publications section
    $('#publications .academic-list li').each(function() {
        // Skip if this is just a label or empty
        var text = $(this).text().trim();
        if (text.length < 20 || ($(this).find('.label-success').length > 0 && text.indexOf('Under Review') > -1 && text.length < 30)) {
            return;
        }

        // Create the button using consistent webpage styling (Bootstrap label-info)
        var copyBtn = $('<span class="label label-info copy-citation-btn" style="cursor:pointer; margin-left:10px;" title="Copy Citation"><i class="fa fa-clipboard"></i> Copy</span>');
        
        // Add click event
        copyBtn.click(function(e) {
            e.stopPropagation();
            
            // Get the parent li text
            var parentLi = $(this).parent();
            
            // Clone it to manipulate text without affecting DOM
            var clone = parentLi.clone();
            
            // Remove the copy button itself from the clone
            clone.find('.copy-citation-btn').remove();
            
            // Remove download links, DOI links if they have visual buttons, etc.
            clone.find('.label-info').remove();
            clone.find('.label-success').remove();
            
            // Get clean text, remove extra whitespace/newlines
            var cleanText = clone.text().replace(/\s+/g, ' ').trim();
            
            // Copy to clipboard
            navigator.clipboard.writeText(cleanText).then(function() {
                // Success - change icon temporarily
                copyBtn.html('<i class="fa fa-check"></i> Copied!');
                copyBtn.css({'background-color': 'var(--primary)', 'color': 'white'});
                
                setTimeout(function() {
                    copyBtn.html('<i class="fa fa-clipboard"></i> Copy');
                    copyBtn.css({'background-color': '', 'color': ''});
                }, 2000);
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
            });
        });
        
        // Append to li, adding a space before it
        $(this).append(' ').append(copyBtn);
    });
});

// ==========================================================================
// SCROLL PROGRESS BAR
// ==========================================================================
$(window).on('scroll', function() {
    // Calculate how far the user has scrolled down the page
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Calculate the total scrollable height of the page
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Calculate the scroll percentage
    var scrolled = (winScroll / height) * 100;
    
    // Update the width of the progress bar
    $('#scroll-progress').css('width', scrolled + '%');
});

// ==========================================================================
// PUBLICATION METRICS CHART
// ==========================================================================
let metricsChartInstance = null;

function renderMetricsChart() {
    if (metricsChartInstance || !window.chartData || !$('#metricsChartContainer').is(':visible')) {
        return; // Already rendered, or data not ready, or container not visible
    }

    let pubCounts = window.chartData.pubCounts;
    let citations = window.chartData.citations;

    // Combine all years from both objects to ensure no missing years
    let allYears = new Set([...Object.keys(pubCounts), ...Object.keys(citations)]);
    let labels = Array.from(allYears).sort();

    let pubData = labels.map(year => pubCounts[year] || 0);
    let citData = labels.map(year => citations[year] || 0);

    // Render Chart
    const ctx = document.getElementById('metricsChart').getContext('2d');
    metricsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Publications per Year',
                    data: pubData,
                    backgroundColor: 'rgba(24, 188, 156, 0.7)', // Theme green (#18bc9c)
                    borderColor: 'rgba(24, 188, 156, 1)',
                    borderWidth: 1,
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'Citations (Google Scholar)',
                    data: citData,
                    type: 'line',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    yAxisID: 'y1',
                    tension: 0.3,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500 // Smooth animation
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Publications',
                        color: '#18bc9c'
                    },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Citations',
                        color: 'rgba(255, 99, 132, 1)'
                    },
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 40,
                        generateLabels: function(chart) {
                            // Create custom "line with dot" canvas
                            if (!window.dotLineCanvas) {
                                const c = document.createElement('canvas');
                                c.width = 40; // 30px line + 10px empty gap for padding
                                c.height = 10;
                                const cx = c.getContext('2d');
                                // Draw Line
                                cx.strokeStyle = 'rgba(255, 99, 132, 1)';
                                cx.lineWidth = 2;
                                cx.beginPath();
                                cx.moveTo(0, 5);
                                cx.lineTo(30, 5); // Stop line at 30px to leave a 10px gap
                                cx.stroke();
                                // Draw Dot
                                cx.fillStyle = 'rgba(255, 99, 132, 1)';
                                cx.beginPath();
                                cx.arc(15, 5, 4, 0, 2 * Math.PI); // Centered at 15
                                cx.fill();
                                window.dotLineCanvas = c;
                            }

                            const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            original.forEach(label => {
                                if (label.text === 'Citations (Google Scholar)') {
                                    label.pointStyle = window.dotLineCanvas;
                                } else {
                                    label.pointStyle = 'rect';
                                    label.text = ' ' + label.text; // Add small space for consistency
                                }
                            });
                            return original;
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}

$(document).ready(function() {
    if ($('#metricsChart').length === 0) return;

    // 1. Parse DOM for Publication Counts
    let pubCounts = {};
    let currentYear = null;

    $('#publications .academic-list').children().each(function() {
        if ($(this).is('p') && $(this).find('.label-success').length > 0) {
            let labelText = $(this).find('.label-success').text().trim();
            if (labelText !== "Under Review" && !isNaN(parseInt(labelText))) {
                currentYear = labelText;
                pubCounts[currentYear] = 0;
            } else {
                currentYear = null;
            }
        } else if ($(this).is('li') && currentYear) {
            pubCounts[currentYear]++;
        }
    });

    // 2. Fetch Google Scholar Citations (Dynamically via GitHub Actions)
    fetch('citations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let citations = data.cites_per_year || data;
            window.chartData = { pubCounts, citations };
            
            if (data.total_citations !== undefined) {
                $('#metric-citations').text(data.total_citations);
                $('#metric-hindex').text(data.h_index);
                $('#metric-i10index').text(data.i10_index);
            }
            
            renderMetricsChart(); // Render if container is already visible
        })
        .catch(error => {
            console.error('Error fetching citations:', error);
            window.chartData = { pubCounts, citations: {} };
            renderMetricsChart(); // Render if container is already visible
        });
});

window.toggleMetricsChart = function() {
    let container = $('#metricsChartContainer');
    if (container.is(':hidden')) {
        // Temporarily show the container without animation so Chart.js can calculate dimensions
        container.show();
        renderMetricsChart();
        // Hide it immediately and then slide down for the animation
        container.hide();
        container.slideDown(300);
    } else {
        container.slideUp(300);
    }
};
