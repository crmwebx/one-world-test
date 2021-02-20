const Items = [
  {
    id: 1,
    name: "Prospective Students",
    url: "#",
    hasSubmenu: true,
    subMenuItems: [
      {
        subId: 1,
        name: "Apply Today",
        url: "/prospective/application",
      },
      // {
      //   subId: 2,
      //   name: "Request Information",
      //   url: "/prospective/inquiry",
      // },
      {
        subId: 3,
        name: "Admission Test",
        url: "/prospective/admission-test",
        display: "none",
      },
      {
        subId: 4,
        name: "Interview Selection",
        url: "/prospective/interview-selection",
        display: "none",
      },
    ],
  },
  {
    id: 2,
    name: "Students",
    url: "#",
    hasSubmenu: true,
    display: "none",
    subMenuItems: [
      {
        subId: 1,
        name: "Profile",
        url: "/students/profile",
      },
      {
        subId: 2,
        name: "Classes",
        url: "/students/classes",
      },
      {
        subId: 3,
        name: "Grades",
        url: "/students/grades",
      },
      {
        subId: 4,
        name: "Select Classes",
        url: "/students/select-class",
      },
    ],
  },
  // {
  //   id: 3,
  //   name: "Faculty & Staff",
  //   url: "#",
  //   hasSubmenu: true,
  //   subMenuItems: [
  //     {
  //       subId: 1,
  //       name: "Profile",
  //       url: "/faculty/profile",
  //     },
  //     {
  //       subId: 2,
  //       name: "classes",
  //       url: "/faculty/classes",
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   name: "Parents",
  //   url: "#",
  //   hasSubmenu: true,
  //   subMenuItems: [
  //     {
  //       subId: 1,
  //       name: "Attandance",
  //       url: "/",
  //     },
  //     {
  //       subId: 2,
  //       name: "Grades",
  //       url: "/",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   name: "Alumni",
  //   url: "#",
  //   hasSubmenu: true,
  //   subMenuItems: [
  //     {
  //       subId: 1,
  //       name: "My Information",
  //       url: "/",
  //     },
  //     {
  //       subId: 2,
  //       name: "Events",
  //       url: "/",
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   name: "Events",
  //   url: "/",
  //   hasSubmenu: false,
  //   subMenuItems: [],
  // },
  // {
  //   id: 7,
  //   name: "Course Catalog",
  //   url: "/",
  //   hasSubmenu: false,
  //   subMenuItems: [],
  // },
  // {
  //   id: 8,
  //   name: "Documents",
  //   url: "/",
  //   hasSubmenu: false,
  //   subMenuItems: [],
  // },
  // {
  //   id: 9,
  //   name: "About",
  //   url: "/",
  //   hasSubmenu: false,
  //   subMenuItems: [],
  // },
];

export default Items;
