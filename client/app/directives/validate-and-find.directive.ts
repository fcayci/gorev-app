// findBusies(gs, ge): Array<string> {
//     const { range } = extendMoment(moment);

//     // Busy people id list.
//     const busyIds = [];
//     const gorevrange = range(gs, ge);

//     // Merge two arrays to have a unified busy object for testing.
//     const busies = Object.assign(this.busytimes, this.opentasks);

//     for (const busy of busies) {

//       // This is only availabe in busytimes, so no worries here
//       if (busy.recur) {
//         const interval = moment(busy.startDate).recur().every(busy.recur).days();

//         if (interval.matches(gs)) {

//           // Since this is an interval, we need to create the exact date for checking.
//           const bs = moment(gs.format('YYYY-MM-DD') + 'T' + moment(busy.startDate).format('HH:mm'));
//           const be = moment(ge.format('YYYY-MM-DD') + 'T' + moment(busy.endDate).format('HH:mm'));
//           const busyrange = range(bs, be);

//           if (busyrange.overlaps(gorevrange)) {
//             if (busyIds.indexOf(busy.owner_id) === -1) {
//               busyIds.push(busy.owner_id);
//             }
//           }
//         }
//       } else {
//         const bs = moment(busy.startDate);
//         const be = moment(busy.endDate);
//         const busyrange = range(bs, be);

//         // This can be both busytimes and tasks
//         if (busyrange.overlaps(gorevrange)) {
//           if (busy.owner_id) {
//             if (busyIds.indexOf(busy.owner_id) === -1) {
//               busyIds.push(busy.owner_id);
//             }
//           } else {
//             for (let i = 0; i < busy.peopleCount; i++) {
//               if (busyIds.indexOf(busy.choosenPeople[i]) === -1) {
//                 busyIds.push(busy.choosenPeople[i]);
//               }
//             }
//           }
//         }
//       }
//     }
//     return busyIds;
//   }

//   validateTimeAndFindAvailable(): void {
//     this.gorevForm.get('when').statusChanges.subscribe(status => {
//       if (status === 'VALID') {
//         const t = this.gorevForm.get('when').value;
//         this.available = [];

//         // Get the dates as is. if .dateOnly() method is used, we lose timezone.
//         let sd = moment(t.gDate);
//         let ed = moment(t.gDate);

//         // Combine the date & times
//         sd = sd.add(t.startTime.slice(0, 2), 'h');
//         sd = sd.add(t.startTime.slice(-2), 'm');
//         ed = ed.add(t.endTime.slice(0, 2), 'h');
//         ed = ed.add(t.endTime.slice(-2), 'm');

//         // Calculate load based on duration and weight
//         t.duration = moment.duration(ed.diff(sd)).as('hours');
//         t.load = t.duration * t.weight;

//         // Make sure start date is after end.
//         if (sd.isSameOrAfter(ed)) {
//           this.formTimeValid = false;
//         } else {
//           this.gorevForm.value.startDate = sd.format();
//           this.gorevForm.value.endDate = ed.format();

//           this.formTimeValid = true;

//           const busyIds = this.findBusies(sd, ed);

//           for (const k of this.kadro ) {
//             if (busyIds.indexOf(k._id) === -1) {
//               this.available.push(k);
//             }
//           }
//           this.available = this._fsort.transform(this.available, 'load');
//           console.log(this.available);
//         }
//       }
//     });
//   }