1. simple scrapping using cheerio

used Cheerio's DOM traversal methods to extract specific parts of the HTML structure.
```
  $(".col-md-4.country") → Selects country containers.
 .find(".country-name").text().trim() → Extracts country name.
 .find(".country-capital").text().trim() → Extracts capital.
 .find(".country-population").text().trim() → Extracts population.
 .find(".country-area").text().trim() → Extracts area.
 ```

example structure (Countries of the World: A Simple Example
A single page that lists information about all the countries in the world.): -

```
<div class="row">
                    
                    <div class="col-md-4 country">
                        <h3 class="country-name">
                            <i class="flag-icon flag-icon-ad"></i>
                            Andorra
                        </h3>
                        <div class="country-info">
                            <strong>Capital:</strong> <span class="country-capital">Andorra la Vella</span><br>
                            <strong>Population:</strong> <span class="country-population">84000</span><br>
                            <strong>Area (km<sup>2</sup>):</strong> <span class="country-area">468.0</span><br>
                        </div>
                    </div><!--.col-->
                    
                    
                    
                    <div class="col-md-4 country">
                        <h3 class="country-name">
                            <i class="flag-icon flag-icon-ae"></i>
                            United Arab Emirates
                        </h3>
                        <div class="country-info">
                            <strong>Capital:</strong> <span class="country-capital">Abu Dhabi</span><br>
                            <strong>Population:</strong> <span class="country-population">4975593</span><br>
                            <strong>Area (km<sup>2</sup>):</strong> <span class="country-area">82880.0</span><br>
                        </div>
                    </div><!--.col-->
                    
                    
                    
                    <div class="col-md-4 country">
                        <h3 class="country-name">
                            <i class="flag-icon flag-icon-af"></i>
                            Afghanistan
                        </h3>
                        <div class="country-info">
                            <strong>Capital:</strong> <span class="country-capital">Kabul</span><br>
                            <strong>Population:</strong> <span class="country-population">29121286</span><br>
                            <strong>Area (km<sup>2</sup>):</strong> <span class="country-area">647500.0</span><br>
                        </div>
                    </div><!--.col-->
</div> 
```


Potential Obstacles in Scraping with Cheerio & How Puppeteer Helps
Using Cheerio with axios works well for static websites where the HTML is already present in the response. However, if the target website loads data dynamically using JavaScript (AJAX calls), Cheerio won't see the updated content because it doesn't execute JavaScript.

Obstacles You Might Face with Cheerio
1. Dynamic Content Loading (AJAX)

2. If the country data loads after the page loads (e.g., from an API request), axios will only fetch the initial HTML, which might be empty or incomplete.
Lazy Loading or Pagination

3. If countries are loaded dynamically as you scroll (infinite scrolling), Cheerio won't detect all elements at once.
Anti-Scraping Measures

4. Some sites detect scrapers using request headers, cookies, or CAPTCHAs. axios (with Cheerio) doesn't mimic a real browser, so the site might block your requests.



2. solving that obstacle using puppeter 

    a) pagination (example structure Hockey Teams: Forms, Searching and Pagination
        Browse through a database of NHL team stats since 1990.):- 

    <tr class="team">
                        <td class="name">
                            Boston Bruins
                        </td>
                        <td class="year">
                            1990
                        </td>
                        <td class="wins">
                            44
                        </td>
                        <td class="losses">
                            24
                        </td>
                        <td class="ot-losses">
                            
                        </td>
                        
                        
                        <td class="pct text-success">
                            0.55
                        </td>
                        
                        <td class="gf">
                            299
                        </td>
                        <td class="ga">
                            264
                        </td>
                        
                        
                        <td class="diff text-success">
                            35
                        </td>
                        
     </tr>
     <tr class = "team">
        ...
     </tr>

    See mediumPuppeter.js to understand 


