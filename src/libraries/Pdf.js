const download = (title,tgl,members) => {
  let contentBody = [];
  let memberInPage = [];
  members.map((m, i)=>{
    let code = "1-"+m.scheduleId;
    let content = [{  text: title, alignment: 'center', bold: true, fontSize: 24, margin: [0, 0, 0, 16]},
                      {
                      table: {
                            body: [
                                ['Name', ":", m.member.name.substr(0,33)],
                                ['Club', ":", m.club.substr(0,33)],
                                ['Kategori', ":", m.categoryLabel.substr(0,33)],
                                ['No Target', ":", ''],
                                ['Code', ":", code],
                                ['Tanggal', ":", tgl],
                            ]
                        },
                        layout: 'noBorders'
                      },
                      {alignment: 'center',
                      table: {
                          heights: [20, 20, 20, 20, 20, 20, 20, 20],
                          widths: [30, 0, "*", "*", "*", "*", "*", "*"],
                          body: 
                          [
                              ['Seri', '',{text: "SCORE", colSpan: 3},{},{},"",'T2S',''],
                              ['1', '', '', '', '', '', {text: "", rowSpan: 2}, '    '],
                              ['', '', '', '', '', '', '', '    '],
                              ['2', '', '', '', '', '', {text: "", rowSpan: 2}, '    '],
                              ['', '', '', '', '', '', '', '    '],
                              ['3', '', '', '', '', '', {text: "", rowSpan: 2}, '    '],
                              ['', '', '', '', '', '', '', '    '],
                              ['4', '', '', '', '', '', {text: "", rowSpan: 2}, '    '],
                              ['', '', '', '', '', '', '', '    '],
                              ['5', '', '', '', '', '', {text: "", rowSpan: 2}, '    '],
                              ['', '', '', '', '', '', '', '    '],
                              ['6', '', '', '', '', '', {text: "", rowSpan: 2}, '    '],
                              ['', '', '', '', '', '', '', '    '],
                              [{text: "", colSpan: 5}, {}, {}, {}, {}, '', '', '    '],
                          ]
                      },
                      layout: {
                        fillColor: function (rowIndex) {
                          return (rowIndex == 3 || rowIndex == 4 || rowIndex == 7 || rowIndex == 8 || rowIndex == 11 || rowIndex == 12) ? '#eeeeee' : null;
                        }
                      }
                    },
                    {qr: code, fit: 55, margin: [0, 4, 0, 0]},
                    ]
    memberInPage.push(content);
    if(memberInPage.length == 2 || members[i+1] == undefined){
      if(memberInPage.length == 1 && members[i+1] == undefined)
        memberInPage.push([]);

      contentBody.push([{columns:memberInPage}]);
      memberInPage = [];
    }    
  })  
  let content = [];
  contentBody.map((c)=>{
    content.push([
                    {columns: c}
                ])
  })
   console.log(contentBody);
  let dd = {
                defaultStyle: {
                  columnGap: 20
                },
                pageOrientation: 'landscape',
                content: content
              }
  pdfMake.createPdf(dd).download();
  }


export default {
    download
}